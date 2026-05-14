/**
 * js/algorithms/srt.js
 * ─────────────────────────────────────────────
 * Shortest Remaining Time (SRT) — Preemptive SJF
 *
 * Core logic:
 *   At every clock tick, the scheduler picks the
 *   process with the smallest REMAINING burst time
 *   from those that have already arrived.
 *   If a new process arrives with a shorter remaining
 *   time than the current one, the current process is
 *   preempted immediately.
 *
 *   Consecutive ticks belonging to the same process
 *   are merged into a single Gantt block for clarity.
 *
 * Complexity: O(n²) — tick-by-tick with ready-queue scan.
 *
 * @param {Object[]} procs - Raw process array
 * @param {Object[]} gantt - Shared gantt list
 * @returns {Object[]}     - Stat results
 */
function runSRT(procs, gantt) {
  const p    = cloneProcesses(procs);
  let time   = 0;
  let prevPid = null; /* track last running PID to merge gantt blocks */

  /* Run until every process has 0 remaining time */
  while (p.some(x => x.remaining > 0)) {
    /* Ready queue: arrived and still has work */
    const ready = p.filter(x => x.remaining > 0 && x.arrival <= time);

    if (!ready.length) {
      /* CPU idle — advance one tick */
      time++;
      prevPid = null;
      continue;
    }

    /* Preemptive choice: shortest remaining time */
    ready.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival);
    const proc = ready[0];

    if (proc.pid !== prevPid) {
      /* New process (or preemption) — start a new gantt block */
      gantt.push({ pid: proc.pid, start: time, end: time + 1 });
      prevPid = proc.pid;
    } else {
      /* Same process continues — extend the current block */
      gantt[gantt.length - 1].end++;
    }

    proc.remaining--;
    time++;

    /* Mark finish time when all burst is consumed */
    if (proc.remaining === 0) proc.finish = time;
  }

  return p.map(proc => buildStat(proc, proc.finish));
}
