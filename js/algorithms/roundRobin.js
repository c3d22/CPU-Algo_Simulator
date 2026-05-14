/**
 * js/algorithms/roundRobin.js
 * ─────────────────────────────────────────────
 * Round Robin (RR)
 *
 * Core logic:
 *   Each process is given a fixed time slice (quantum).
 *   The ready queue is maintained in FIFO order.
 *   When a process's quantum expires, it is moved to
 *   the back of the queue if it still has remaining
 *   burst time. Newly arrived processes are admitted
 *   to the queue after each quantum completes.
 *
 *   Admission order: processes that arrive during a
 *   quantum are added AFTER the current process is
 *   re-queued (if not finished), preserving fairness.
 *
 * Complexity: O(n * ceil(burst / quantum))
 *
 * @param {Object[]} procs    - Raw process array
 * @param {number}   quantum  - Time quantum (TQ)
 * @param {Object[]} gantt    - Shared gantt list
 * @returns {Object[]}        - Stat results
 */
function runRoundRobin(procs, quantum, gantt) {
  const p     = cloneProcesses(procs);
  const added = new Array(p.length).fill(false); /* tracks queue admission */
  const queue = [];  /* FIFO ready queue (stores process indices) */
  let time    = 0;

  /* Seed the queue with processes arriving at or before t=0 */
  p.forEach((x, i) => {
    if (x.arrival <= 0) { queue.push(i); added[i] = true; }
  });

  while (queue.length) {
    const idx  = queue.shift();
    const proc = p[idx];

    /* Execute for min(remaining, quantum) ticks */
    const exec = Math.min(proc.remaining, quantum);
    gantt.push({ pid: proc.pid, start: time, end: time + exec });
    time          += exec;
    proc.remaining -= exec;

    /* Admit any processes that arrived during this quantum */
    p.forEach((x, i) => {
      if (!added[i] && x.arrival <= time) { queue.push(i); added[i] = true; }
    });

    if (proc.remaining > 0) {
      /* Process not done — re-queue it at the back */
      queue.push(idx);
    } else {
      /* Process finished */
      proc.finish = time;
    }
  }

  return p.map(proc => buildStat(proc, proc.finish));
}
