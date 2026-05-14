/**
 * js/algorithms/fcfs.js
 * ─────────────────────────────────────────────
 * First-Come, First-Served (FCFS) — Non-preemptive
 *
 * Core logic:
 *   Processes are sorted by arrival time and executed
 *   one after another in that order.  The CPU never
 *   interrupts a running process.  If the CPU becomes
 *   free before the next process arrives, it waits
 *   (idle gap) until that process is ready.
 *
 * Complexity: O(n log n) due to sort.
 *
 * @param {Object[]} procs - Raw process array from getProcesses()
 * @param {Object[]} gantt - Shared gantt list; blocks are pushed here
 * @returns {Object[]}     - Array of buildStat() result objects
 */
function runFCFS(procs, gantt) {
  /* Sort a copy by arrival time (stable, ascending) */
  const p = cloneProcesses(procs).sort((a, b) => a.arrival - b.arrival);

  let time = 0; /* current clock */

  return p.map(proc => {
    /* If CPU is idle waiting for this process, advance clock */
    if (time < proc.arrival) time = proc.arrival;

    /* Run the process to completion (non-preemptive) */
    gantt.push({ pid: proc.pid, start: time, end: time + proc.burst });
    const finish = time + proc.burst;
    time = finish;

    return buildStat(proc, finish);
  });
}
