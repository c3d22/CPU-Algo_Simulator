/**
 * js/main.js
 * ─────────────────────────────────────────────
 * Application entry point.
 *
 * Responsibilities:
 *   - Listen for the Calculate button click
 *   - Read the selected algorithm from the dropdown
 *   - Dispatch to the correct algorithm module
 *   - Pass results to the renderer
 *
 * This file intentionally contains NO scheduling logic
 * and NO DOM rendering — it is a pure coordinator.
 *
 * Dependency load order (see index.html <script> tags):
 *   helpers.js → renderer.js → algorithm files → ui.js → main.js
 */

/**
 * runAlgorithm()
 * ──────────────
 * Reads user input, selects the appropriate scheduling
 * function, runs it, and triggers output rendering.
 *
 * Input:  DOM state (algorithm dropdown, process rows)
 * Output: Gantt chart + stats table rendered in #outputPanel
 */
function runAlgorithm() {
const algo      = algoSelect.value;       /* from ui.js */
const processes = getProcesses();         /* from ui.js */

if (!processes.length) return;

const gantt   = []; /* populated by algorithm functions */
let   results = [];

/* ── Dispatch to the correct algorithm module ── */
switch (algo) {

  case 'fcfs':
    /* First-Come First-Served — see js/algorithms/fcfs.js */
    results = runFCFS(processes, gantt);
    break;

  case 'sjf':
    /* Shortest Job First (Non-Preemptive) — see js/algorithms/sjf.js */
    results = runSJF(processes, gantt);
    break;

  case 'srt':
    /* Shortest Remaining Time (Preemptive) — see js/algorithms/srt.js */
    results = runSRT(processes, gantt);
    break;

  case 'round_robin':
    /* Round Robin — see js/algorithms/roundRobin.js */
    results = runRoundRobin(processes, getTimeQuantum(), gantt);
    break;

  case 'priority': {
    /* Priority Scheduling — mode chosen by sub-dropdown */
    const mode = document.getElementById('priorityMode').value;
    results = (mode === 'preemptive')
      ? runPriorityPreemptive(processes, gantt)      /* js/algorithms/priority.js */
      : runPriorityNonPreemptive(processes, gantt);  /* js/algorithms/priority.js */
    break;
  }

  case 'priority_rr':
    /* Priority + Round Robin — see js/algorithms/priorityRR.js */
    results = runPriorityRR(processes, getTimeQuantum(), gantt);
    break;

  default:
    console.warn(`Unknown algorithm: ${algo}`);
    return;
}

/* ── Render output ── */
/* Pass showPrio=true only for priority-based algorithms
    so the Priority column appears in the stats table     */
renderOutput(gantt, results, needsPriority());
}

/* ── Wire up the Calculate button ── */
calcBtn.addEventListener('click', runAlgorithm);
