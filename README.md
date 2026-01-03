# SkyRoute – UAV Route Optimization Simulator

SkyRoute is a **real-time UAV (Unmanned Aerial Vehicle) route simulation system** that demonstrates how a drone navigates from a start point to a destination while avoiding obstacles and dynamically re-routing when conditions change.

The project focuses on **path planning, real-time visualization, system design, and user interaction**, rather than hardware control.

---

## 🚀 Key Features

### 🧭 Route Optimization Modes
- **Shortest Path** – finds the minimum distance route
- **Safe Path** – avoids congested and risky areas
- **Fast Path** – prefers straighter paths with fewer turns

### 🔄 Real-Time Simulation
- Step-by-step UAV movement
- Live re-routing when obstacles are added or removed
- Speed control (Slow / Medium / Fast)

### 🧱 Interactive Grid (15 × 15)
- Click any cell to **add or remove obstacles**
- Dynamic response to environmental changes
- Clear visual representation of navigation

### 🏙️ Scenario Presets
- **Urban** – structured obstacles like buildings
- **Dense** – heavy obstacle environment
- **Open** – minimal obstacles

### 📊 Metrics Dashboard
- Current routing mode
- UAV speed level
- Steps taken
- Path length
- Number of re-routes

### 🎨 Visual Legend
- 🟦 Start point  
- 🟨 Destination  
- 🟣 UAV (current position)  
- 🟩 Travelled path  
- 🟥 Obstacle / restricted zone  
- ⬜ Free space  

---

## 🧠 Why This Project?

This project was built to:
- Understand **route planning logic**
- Simulate **real-time decision making**
- Practice **frontend–backend integration**
- Visualize complex behavior instead of static outputs
- Build an **end-to-end interactive system**

The concepts demonstrated here are foundational to:
- Drone navigation
- Robotics
- Autonomous systems
- GPS routing
- Path planning algorithms

---

## 🧱 System Architecture

Frontend (React)
⇄ REST APIs (JSON)
Backend (Python + Flask)

````

### Frontend (React)
- Renders the grid and UAV movement
- Handles user interactions (controls, obstacles, scenarios)
- Displays live metrics and visualization

### Backend (Flask, Python)
- Maintains grid state
- Computes routes using BFS-based logic
- Handles obstacle updates and scenarios
- Sends updated routes to frontend

---

## 🛠️ Tech Stack

- **Frontend:** React, JavaScript
- **Backend:** Python, Flask
- **Communication:** REST APIs (JSON)
- **Algorithm:** BFS-based path planning
- **UI:** Grid-based real-time visualization

---

## ▶️ How to Run the Project

### 1️⃣ Backend

cd backend
python app.py

Runs on:
http://127.0.0.1:5000

### 2️⃣ Frontend

cd frontend
npm start

Open in browser:
http://localhost:3000

---

## ⚠️ Limitations

* Grid-based simulation (not GPS-based)
* No real drone hardware integration
* No physical flight dynamics or battery modeling
* Single UAV simulation

These are intentional design choices to focus on **logic, visualization, and system behavior**.

---

## 🔮 Possible Future Enhancements

* GPS-based coordinate mapping
* Multi-UAV simulation with collision avoidance
* Battery and energy consumption modeling
* Integration with drone simulators (ROS / MAVLink)
* No-fly zone enforcement

---

## 📌 Note

This project is a **simulation and planning system**, not a real drone controller.
However, the routing and decision logic can be extended to real-world UAV systems using appropriate middleware and flight controllers.

---

## 👤 Author

**Shafail Siddiqha**
GitHub: [https://github.com/ShafailSiddiqha](https://github.com/ShafailSiddiqha)




