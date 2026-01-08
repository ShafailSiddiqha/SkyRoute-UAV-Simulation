import React, { useEffect, useState, useCallback } from "react";

const GRID_SIZE = 15;
const CELL_SIZE = 36;

function App() {
  const [grid, setGrid] = useState([]);
  const [route, setRoute] = useState([]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("shortest");
  const [speed, setSpeed] = useState(400);
  const [reroutes, setReroutes] = useState(0);

  const speedLabel =
    speed === 800 ? "Slow" : speed === 400 ? "Medium" : "Fast";

  const status =
    running
      ? "🟢 Running"
      : index > 0 && index >= route.length - 1
      ? "✅ Completed"
      : "⏸ Paused";

  const fetchRoute = useCallback((current = null) => {
    fetch("http://127.0.0.1:5000/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, current })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setGrid(data.grid);
          setRoute(data.route);
          setIndex(0);
        }
      });
  }, [mode]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  useEffect(() => {
    if (!running || route.length === 0) return;
    const timer = setInterval(() => {
      setIndex(i => {
        if (i >= route.length - 1) {
          setRunning(false);
          return i;
        }
        return i + 1;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [running, route, speed]);

  const toggleObstacle = (r, c) => {
    fetch("http://127.0.0.1:5000/toggle-obstacle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: r, y: c })
    }).then(() => {
      setReroutes(r => r + 1);
      fetchRoute(route[index]);
    });
  };

  const scenario = (name) => {
    fetch("http://127.0.0.1:5000/scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(data => {
        setGrid(data.grid);
        setReroutes(0);
        setIndex(0);
        setRunning(false);
      });
  };

  const getColor = (r, c) => {
    if (route.slice(0, index).some(p => p.x === r && p.y === c))
      return "#2ecc71";
    if (r === 0 && c === 0) return "#3498db";
    if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1) return "#f1c40f";
    if (grid[r]?.[c] === 1) return "#e74c3c";
    return "#ffffff";
  };

  const MetricRow = ({ icon, label, value, tip }) => (
    <div
      title={tip}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 12px",
        borderRadius: "6px",
        background: "#f4f6f8",
        marginBottom: "8px",
        fontSize: "14px",
        cursor: "help"
      }}
    >
      <span>{icon} {label}</span>
      <strong>{value}</strong>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      background: "#f4f6f8"
    }}>
      <div style={{ width: "1200px", padding: "20px" }}>

        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          SkyRoute – Advanced UAV Simulator
        </h2>

        <p style={{ textAlign: "center", marginBottom: "16px", color: "#555" }}>
          Status: <strong>{status}</strong>
        </p>

        {/* Control Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "#ffffff",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <label>Route:</label>
            <select value={mode} onChange={e => setMode(e.target.value)}>
              <option value="shortest">Shortest</option>
              <option value="safe">Safe</option>
              <option value="fast">Fast</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label>Speed:</label>
            <input
              type="range"
              min="200"
              max="800"
              step="200"
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
            />
            <strong>{speedLabel}</strong>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setRunning(true)}>▶ Start</button>
            <button onClick={() => scenario("urban")}>Urban</button>
            <button onClick={() => scenario("dense")}>Dense</button>
            <button onClick={() => scenario("open")}>Open</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px" }}>

          {/* Metrics Panel */}
          <div style={{
            width: "280px",
            background: "linear-gradient(135deg, #ffffff, #eef2f7)",
            padding: "18px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
          }}>
            <h4 style={{ marginBottom: "14px", textAlign: "center" }}>
              📊 Live Metrics
            </h4>

            <MetricRow icon="🧭" label="Mode" value={mode} tip="Current routing strategy" />
            <MetricRow icon="⚡" label="Speed" value={speedLabel} tip="UAV movement speed" />
            <MetricRow icon="👣" label="Steps" value={index} tip="Cells traversed so far" />
            <MetricRow icon="📏" label="Path Length" value={route.length} tip="Total planned route length" />
            <MetricRow icon="🔁" label="Re-routes" value={reroutes} tip="Times route was recalculated" />
          </div>

          {/* Grid */}
          <div style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
            }}>
              {grid.map((row, r) =>
                row.map((_, c) => (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => toggleObstacle(r, c)}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      border: "1px solid #555",
                      backgroundColor: getColor(r, c),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      transition: "background-color 0.25s ease"
                    }}
                  >
                    {route[index] &&
                     route[index].x === r &&
                     route[index].y === c
                      ? <span style={{
                          animation: "pulse 1s infinite"
                        }}>🚁</span>
                      : ""}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{
          marginTop: "20px",
          textAlign: "center",
          background: "#ffffff",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}>
          🟦 Start &nbsp; 🟨 Destination &nbsp; 🚁 UAV &nbsp;
          🟩 Path &nbsp; 🟥 Obstacle &nbsp; ⬜ Free
        </div>

        {/* Animation */}
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
          `}
        </style>

      </div>
    </div>
  );
}

export default App;
