/**
 * js/algorithms/priority.js
 * ─────────────────────────────────────────────
 * Priority Scheduling — Non-Preemptive & Preemptive
 *
 * Convention: LOWER priority number = HIGHER urgency.
 *   e.g. priority 0 runs before priority 5.
 *
 * ── Non-Preemptive ──────────────────────────
 * Core logic:
 *   When the CPU is free, the highest-priority
 *   process in the ready queue is selected and
 *   runs to completion. No interruption occurs
 *   even if a higher-priority process arrives.
 *
 * ── Preemptive ──────────────────────────────
 * Core logic:
 *   At every clock tick, the scheduler re-evaluates
 *   the ready queue. If a newly arrived process has
 *   higher priority than the running one, it
 *   immediately preempts it. Consecutive ticks of
 *   the same process are merged in the Gantt chart.
 */

/**
 * runPriorityNonPreemptive()
 *
 * @param {Object[]} procs - Raw process array
 * @param {Object[]} gantt - Shared gantt list
 * @returns {Object[]}     - Stat results
 */
function runPriorityNonPreemptive(procs, gantt) {
  const p       = cloneProcesses(procs).map((x, i) => ({ ...x, i }));
  const done    = new Array(p.length).fill(false);
  const results = [];
  let time      = 0;

  while (results.length < p.length) {
    /* Ready queue: arrived and not yet completed */
    const ready = p.filter(x => !done[x.i] && x.arrival <= time);

    if (!ready.length) { time++; continue; }

    /* Select highest priority (lowest number); tie-break by arrival */
    ready.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);
    const proc = ready[0];

    /* Run selected process to completion */
    gantt.push({ pid: proc.pid, start: time, end: time + proc.burst });
    time += proc.burst;
    done[proc.i] = true;
    results.push(buildStat(proc, time));
  }

  return results;
}

/**
 * runPriorityPreemptive()
 *
 * @param {Object[]} procs - Raw process array
 * @param {Object[]} gantt - Shared gantt list
 * @returns {Object[]}     - Stat results
 */
function runPriorityPreemptive(procs, gantt) {
  const p       = cloneProcesses(procs);
  let time      = 0;
  let prevPid   = null; /* for Gantt block merging */

  while (p.some(x => x.remaining > 0)) {
    /* Ready queue: arrived and still has remaining burst */
    const ready = p.filter(x => x.remaining > 0 && x.arrival <= time);

    if (!ready.length) { time++; prevPid = null; continue; }

    /* Pick highest priority at this tick */
    ready.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);
    const proc = ready[0];

    if (proc.pid !== prevPid) {
      /* Preemption or new start — open a new Gantt block */
      gantt.push({ pid: proc.pid, start: time, end: time + 1 });
      prevPid = proc.pid;
    } else {
      /* Continue same process — extend current block */
      gantt[gantt.length - 1].end++;
    }

    proc.remaining--;
    time++;
    if (proc.remaining === 0) proc.finish = time;
  }

  return p.map(proc => buildStat(proc, proc.finish));
}
