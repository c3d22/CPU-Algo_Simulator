/**
 * js/algorithms/sjf.js
 * ─────────────────────────────────────────────
 * Shortest Job First (SJF) — Non-preemptive
 *
 * Core logic:
 *   At each scheduling decision point (when the CPU
 *   becomes free), the algorithm picks the available
 *   process with the smallest burst time.
 *   "Available" means: arrived AND not yet completed.
 *   Once a process starts, it runs to completion.
 *
 *   Ties in burst time are broken by arrival time (FCFS).
 *
 * Complexity: O(n²) — each completion scans the ready queue.
 *
 * @param {Object[]} procs - Raw process array
 * @param {Object[]} gantt - Shared gantt list
 * @returns {Object[]}     - Stat results
 */
function runSJF(procs, gantt) {
  /* Tag each process with its original index to track completion */
  const p       = cloneProcesses(procs).map((x, i) => ({ ...x, i }));
  const done    = new Array(p.length).fill(false);
  const results = [];
  let time      = 0;

  while (results.length < p.length) {
    /* Build the ready queue: arrived and not yet done */
    const ready = p.filter(x => !done[x.i] && x.arrival <= time);

    if (!ready.length) {
      /* No process ready — advance clock to the next arrival */
      time++;
      continue;
    }

    /* Pick the shortest burst; break ties by arrival order */
    ready.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);
    const proc = ready[0];

    /* Execute the chosen process to completion */
    gantt.push({ pid: proc.pid, start: time, end: time + proc.burst });
    time += proc.burst;
    done[proc.i] = true;
    results.push(buildStat(proc, time));
  }

  return results;
}
