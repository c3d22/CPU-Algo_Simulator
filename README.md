[(https://c3d22.github.io/CPU-Algo_Simulator/](https://c3d22.github.io/CPU-Algo_Simulator/)

# CPU Scheduling Algorithm Simulator

A web-based CPU scheduling simulator that visualises how different scheduling algorithms manage process execution. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

---
## 🚀 How to Run

GitHub Pages (already deployed)

Just visit the live link at the top of this README — no installation needed.

---
## 🔗 Live Demo

**GDRIVE:** [https://drive.google.com/drive/u/0/folders/11Svjs0x4n2V9rgThcnT7BSM0wsJTinfz](https://drive.google.com/drive/u/0/folders/11Svjs0x4n2V9rgThcnT7BSM0wsJTinfz)

> The link above contains a video demonstration of the system in action.

---

## 🖥️ How to Use

1. **Select an algorithm** from the dropdown on the left panel
   - If you pick *Priority Scheduling*, a second dropdown appears to choose between Preemptive and Non-Preemptive
2. **Enter the number of processes** (1–20) and click **CONFIRM**
3. **Fill in** the Arrival Time, Burst Time, and Priority (if applicable) for each process
   - For Round Robin or Priority + Round Robin, also enter a **Time Quantum**
4. Click **CALCULATE**
5. The right panel displays:
   - **Gantt Chart** — execution timeline with idle gaps
   - **Process Statistics** — per-process computed values
   - **Average TAT / WT** — overall performance metrics

---


## 📋 Supported Algorithms

| Algorithm | Type | Description |
|---|---|---|
| **FCFS** | Non-Preemptive | Processes run in arrival order. First in, first served. |
| **SJF** | Non-Preemptive | Shortest burst time runs first among available processes. |
| **SRT** | Preemptive | Preempts current process if a shorter remaining time is found. |
| **Round Robin** | Preemptive | Each process gets a fixed time quantum, cycling through the queue. |
| **Priority** | Non-Preemptive / Preemptive | Runs by priority number (lower = higher urgency). Mode selectable via dropdown. |
| **Priority + Round Robin** | Preemptive | Priority ordering with round-robin fairness within same-priority groups. |

---

## ✨ Features

- **Gantt Chart** — Visual timeline of process execution with idle blocks shown for CPU gaps
- **Process Statistics Table** — Per-process Finish Time, Turnaround Time, and Waiting Time
- **Average Metrics** — Average Turnaround Time and Average Waiting Time displayed after each run
- **Dynamic Inputs** — Input rows are generated based on the number of processes you enter
- **Priority Column** — Automatically appears when a priority-based algorithm is selected
- **Time Quantum Input** — Appears only for Round Robin and Priority + Round Robin
- **Idle Block Detection** — Gantt chart shows `IDLE` gaps when no process is ready to run
- **Responsive Design** — Works on split-screen, tablet, and mobile layouts

---

## 🗂️ Project Structure

```
cpu-scheduler/
├── index.html                        # Main HTML entry point
│
├── css/
│   ├── base.css                      # CSS reset, design tokens, font imports
│   ├── layout.css                    # Two-column sidebar + output panel layout
│   ├── controls.css                  # Buttons, selects, inputs, cards
│   ├── process.css                   # Process input rows, PID badge, time quantum
│   ├── gantt.css                     # Gantt chart blocks and idle block styling
│   ├── stats.css                     # Statistics table and average metric cards
│   └── responsive.css                # Breakpoints for split-screen and mobile
│
└── js/
    ├── algorithms/
    │   ├── fcfs.js                   # First-Come First-Served
    │   ├── sjf.js                    # Shortest Job First (Non-Preemptive)
    │   ├── srt.js                    # Shortest Remaining Time (Preemptive)
    │   ├── roundRobin.js             # Round Robin
    │   ├── priority.js               # Priority Scheduling (both modes)
    │   └── priorityRR.js             # Priority + Round Robin
    │
    ├── utils/
    │   ├── helpers.js                # buildStat(), average(), cloneProcesses()
    │   └── renderer.js               # Gantt chart and stats table rendering
    │
    ├── ui.js                         # Input generation, dropdown handling, DOM reads
    └── main.js                       # Entry point — dispatches to algorithms + renderer
```

---


## 📐 Algorithm Reference

### Formulas

| Metric | Formula |
|---|---|
| Turnaround Time (TAT) | `Finish Time − Arrival Time` |
| Waiting Time (WT) | `Turnaround Time − Burst Time` |
| Average TAT | `Σ TAT / n` |
| Average WT | `Σ WT / n` |

### Priority Convention

For Priority Scheduling and Priority + Round Robin, a **lower priority number means higher urgency**.

| Priority Number | Meaning |
|---|---|
| 0 | Highest priority — runs first |
| 5 | Lower priority — runs later |

---

## 🛠️ Technologies Used

- **HTML5** — semantic structure
- **CSS3** — custom properties, flexbox, CSS Grid, media queries
- **Vanilla JavaScript** — no libraries or frameworks
- **Google Fonts** — JetBrains Mono, Fira Code

---

## 👨‍💻 Authors

> Add your name(s) here.

---

## 📄 License

This project is for educational purposes.
