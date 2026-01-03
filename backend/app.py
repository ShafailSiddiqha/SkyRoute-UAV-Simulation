from flask import Flask, jsonify, request
from flask_cors import CORS
from collections import deque

app = Flask(__name__)
CORS(app)

GRID_SIZE = 15

START = (0, 0)
END = (GRID_SIZE - 1, GRID_SIZE - 1)

def empty_grid():
    return [[0 for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]

grid = empty_grid()

DIRECTIONS = {
    "shortest": [(0,1),(1,0),(-1,0),(0,-1)],
    "safe": [(1,0),(0,1),(-1,0),(0,-1)],
    "fast": [(0,1),(1,0)]
}

def bfs(start, end, mode):
    queue = deque([[start]])
    visited = set([start])

    while queue:
        path = queue.popleft()
        x, y = path[-1]

        if (x, y) == end:
            return [{"x": p[0], "y": p[1]} for p in path]

        for dx, dy in DIRECTIONS[mode]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < GRID_SIZE and 0 <= ny < GRID_SIZE:
                if grid[nx][ny] == 0 and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    queue.append(path + [(nx, ny)])
    return None

@app.route("/route", methods=["POST"])
def route():
    data = request.json or {}
    mode = data.get("mode", "shortest")
    current = data.get("current")

    start = START if not current else (current["x"], current["y"])
    path = bfs(start, END, mode)

    if not path:
        return jsonify({"status": "failed", "grid": grid})

    return jsonify({
        "status": "success",
        "grid": grid,
        "route": path
    })

@app.route("/toggle-obstacle", methods=["POST"])
def toggle_obstacle():
    x, y = request.json["x"], request.json["y"]
    if (x, y) not in [START, END]:
        grid[x][y] = 0 if grid[x][y] == 1 else 1
    return jsonify({"grid": grid})

@app.route("/scenario", methods=["POST"])
def scenario():
    global grid
    grid = empty_grid()
    name = request.json["name"]

    if name == "urban":
        for i in range(3, GRID_SIZE-3):
            grid[i][5] = 1
            grid[5][i] = 1

    elif name == "dense":
        for i in range(1, GRID_SIZE-1):
            for j in range(1, GRID_SIZE-1):
                if (i + j) % 3 == 0:
                    grid[i][j] = 1

    elif name == "open":
        grid = empty_grid()

    return jsonify({"grid": grid})

if __name__ == "__main__":
    app.run(debug=True)
