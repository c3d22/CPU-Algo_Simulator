/**
 * js/utils/helpers.js
 * ─────────────────────────────────────────────
 * Shared pure utility functions used across
 * algorithms and the UI layer.
 *
 * No DOM access — these are stateless helpers.
 */

/**
 * buildStat()
 * ───────────
 * Constructs a result object for one process after
 * it finishes execution.
 *
 * @param {Object} proc   - Process object {pid, arrival, burst, priority}
 * @param {number} finish - The clock time when the process completed
 * @returns {Object}      - Enriched result with TAT and WT
 *
 * Turnaround Time (TAT) = Finish Time − Arrival Time
 * Waiting Time    (WT)  = Turnaround Time − Burst Time
 */
function buildStat(proc, finish) {
  const tat = finish - proc.arrival;
  const wt  = tat - proc.burst;
  return {
    pid:      proc.pid,
    arrival:  proc.arrival,
    burst:    proc.burst,
    priority: proc.priority ?? 0,
    finish,
    tat,
    wt
  };
}

/**
 * average()
 * ─────────
 * Returns the arithmetic mean of a numeric array,
 * rounded to 2 decimal places.
 *
 * @param {number[]} values
 * @returns {string}  e.g. "4.50"
 */
function average(values) {
  if (!values.length) return '0.00';
  const sum = values.reduce((acc, v) => acc + v, 0);
  return (sum / values.length).toFixed(2);
}

/**
 * cloneProcesses()
 * ─────────────────
 * Deep-copies an array of process objects so that
 * algorithms never mutate the original input data.
 *
 * @param {Object[]} procs
 * @returns {Object[]}
 */
function cloneProcesses(procs) {
  return procs.map(p => ({ ...p, remaining: p.burst, finish: 0 }));
}
