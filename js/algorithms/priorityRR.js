/**
 * js/algorithms/priorityRR.js
 * ─────────────────────────────────────────────
 * Priority Scheduling with Round Robin
 *
 * Core logic:
 *   Combines priority and round-robin scheduling:
 *   - Processes are ordered by priority (lower = higher urgency).
 *   - Within the same priority level, processes share
 *     the CPU in round-robin fashion using the given quantum.
 *   - When a new process is admitted to the queue, it is
 *     inserted at the correct priority position (not the back),
 *     so a high-priority newcomer runs before lower-priority ones
 *     already waiting.
 *
 * Complexity: O(n * ceil(burst / quantum)) with priority sort overhead.
 *
 * @param {Object[]} procs   - Raw process array
 * @param {number}   quantum - Time quantum for RR within same priority
 * @param {Object[]} gantt   - Shared gantt list
 * @returns {Object[]}       - Stat results
 */
function runPriorityRR(procs, quantum, gantt) {
  const p     = cloneProcesses(procs);
  const added = new Array(p.length).fill(false);
  const queue = []; /* stores process indices, ordered by priority */
  let time    = 0;

  /**
   * enqueue()
   * Inserts a process index into the queue at the correct
   * position based on its priority (lower number = earlier).
   * Within the same priority, new arrivals go to the back
   * (FIFO among equals), preserving round-robin fairness.
   *
   * @param {number} idx - Index into the process array p[]
   */
  function enqueue(idx) {
    let insertAt = queue.length; /* default: append to back */

    for (let i = 0; i < queue.length; i++) {
      if (p[idx].priority < p[queue[i]].priority) {
        insertAt = i; /* found a lower-priority process — insert before it */
        break;
      }
    }

    queue.splice(insertAt, 0, idx);
    added[idx] = true;
  }

  /* Seed the queue with processes arriving at t ≤ 0 */
  p.forEach((x, i) => { if (x.arrival <= 0) enqueue(i); });

  while (queue.length) {
    const idx  = queue.shift();
    const proc = p[idx];

    /* Execute for min(remaining, quantum) ticks */
    const exec = Math.min(proc.remaining, quantum);
    gantt.push({ pid: proc.pid, start: time, end: time + exec });
    time          += exec;
    proc.remaining -= exec;

    /* Admit newly arrived processes (inserted by priority) */
    p.forEach((x, i) => {
      if (!added[i] && x.arrival <= time) enqueue(i);
    });

    if (proc.remaining > 0) {
      /* Not done — re-enqueue by priority (may yield to higher-priority) */
      enqueue(idx);
    } else {
      proc.finish = time;
    }
  }

  return p.map(proc => buildStat(proc, proc.finish));
}
