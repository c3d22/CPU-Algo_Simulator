/**
 * js/utils/renderer.js
 * ─────────────────────────────────────────────
 * Responsible for ALL DOM output:
 *   - Gantt chart (with idle blocks)
 *   - Process statistics table
 *   - Average TAT / WT cards
 *
 * Inputs come from algorithm result arrays and a
 * raw gantt event list. This module never runs
 * scheduling logic — it only renders.
 */

/* Colour palette for process blocks (cycles if > 16 processes) */
const BLOCK_COLORS = [
  '#3ddc97','#20b07a','#5ce0b0','#0e8a5f',
  '#7aecb8','#156b4a','#a8f5d8','#2cc588',
  '#4fc4a0','#1a9e6e','#68d9b0','#0c7a53',
  '#90eec6','#239c6a','#b8fce0','#38d494'
];

/* Pixels per time unit in the Gantt chart */
const PX_PER_UNIT = 34;

/**
 * buildColorMap()
 * ───────────────
 * Assigns a consistent colour to each unique PID
 * found in the gantt block list.
 *
 * @param {Object[]} gantt - List of {pid, start, end}
 * @returns {Object}       - { 'P1': '#3ddc97', ... }
 */
function buildColorMap(gantt) {
  const map = {};
  let idx = 0;
  gantt.forEach(b => {
    if (!map[b.pid]) map[b.pid] = BLOCK_COLORS[idx++ % BLOCK_COLORS.length];
  });
  return map;
}

/**
 * injectIdleBlocks()
 * ──────────────────
 * Scans the raw gantt list for time gaps between
 * consecutive blocks and inserts IDLE placeholder
 * entries to represent CPU idle periods.
 *
 * Example: if P1 starts at t=3 but the CPU was free
 * from t=0, an IDLE block [0,3] is inserted before P1.
 *
 * @param {Object[]} gantt - Raw algorithm output
 * @returns {Object[]}     - Display list with IDLE blocks inserted
 */
function injectIdleBlocks(gantt) {
  const display = [];
  let cursor = 0;

  gantt.forEach(block => {
    if (block.start > cursor) {
      /* Gap detected — insert an idle block */
      display.push({ pid: 'IDLE', start: cursor, end: block.start, idle: true });
    }
    display.push({ ...block, idle: false });
    cursor = block.end;
  });

  return display;
}

/**
 * renderGantt()
 * ─────────────
 * Builds and inserts the visual Gantt chart.
 * Each block's width is proportional to its duration.
 * A final end-time label is appended after all blocks.
 *
 * @param {Object[]} gantt    - Raw gantt list from algorithm
 * @param {Object}   colorMap - PID → colour mapping
 */
function renderGantt(gantt, colorMap) {
  const chart = document.getElementById('ganttChart');
  chart.innerHTML = '';

  /* Insert idle blocks where the CPU has nothing to run */
  const displayBlocks = injectIdleBlocks(gantt);

  displayBlocks.forEach(block => {
    const duration = block.end - block.start;
    const width    = Math.max(48, duration * PX_PER_UNIT);

    const div = document.createElement('div');
    div.className = block.idle ? 'gantt-block gantt-idle' : 'gantt-block';
    if (!block.idle) div.style.background = colorMap[block.pid];
    div.style.minWidth  = width + 'px';
    div.style.flexBasis = width + 'px';

    /* Block label + start-time stamp */
    div.innerHTML = `${block.pid}<span class="gtime">${block.start}</span>`;
    chart.appendChild(div);
  });

  /* Final end-time label (not a real block — just a timestamp) */
  if (gantt.length) {
    const endLabel = document.createElement('div');
    endLabel.className = 'gantt-block';
    Object.assign(endLabel.style, {
      background: 'transparent', color: 'var(--label)',
      fontSize: '11px', fontWeight: '400', minWidth: 'auto',
      padding: '0 8px', justifyContent: 'flex-end',
      alignItems: 'flex-end', paddingBottom: '4px'
    });
    endLabel.textContent = gantt[gantt.length - 1].end;
    chart.appendChild(endLabel);
  }

  /* Make the gantt wrapper visible */
  document.getElementById('ganttWrap').classList.add('visible');
}

/**
 * renderStats()
 * ─────────────
 * Populates the process statistics table with one
 * row per process showing all computed metrics.
 * Shows/hides the Priority column depending on the
 * selected algorithm.
 *
 * @param {Object[]} results  - Array of buildStat() objects
 * @param {Object}   colorMap - PID → colour
 * @param {boolean}  showPrio - Whether to display the Priority column
 */
function renderStats(results, colorMap, showPrio) {
  const tbody      = document.getElementById('statsBody');
  const prioHeader = document.querySelector('.col-priority');

  /* Toggle priority column visibility */
  prioHeader.style.display = showPrio ? '' : 'none';
  tbody.innerHTML = '';

  results.forEach((r, i) => {
    const color = colorMap[r.pid] || BLOCK_COLORS[i % BLOCK_COLORS.length];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="pid-col" style="color:${color}">${r.pid}</td>
      <td>${r.arrival}</td>
      <td>${r.burst}</td>
      ${showPrio ? `<td>${r.priority}</td>` : ''}
      <td>${r.finish}</td>
      <td>${r.tat}</td>
      <td>${r.wt}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('statsWrap').style.display = 'block';
}

/**
 * renderAverages()
 * ────────────────
 * Computes and displays average Turnaround Time
 * and average Waiting Time from the results array.
 *
 * @param {Object[]} results - Array of buildStat() objects
 */
function renderAverages(results) {
  document.getElementById('avgTAT').textContent =
    average(results.map(r => r.tat));
  document.getElementById('avgWT').textContent =
    average(results.map(r => r.wt));

  document.getElementById('avgRow').classList.add('visible');
}

/**
 * renderOutput()
 * ──────────────
 * Master render function called by main.js after
 * an algorithm finishes. Orchestrates all sub-renders.
 *
 * @param {Object[]} gantt    - Raw gantt list {pid, start, end}
 * @param {Object[]} results  - Per-process stat objects
 * @param {boolean}  showPrio - Show priority column in table
 */
function renderOutput(gantt, results, showPrio) {
  /* Hide the empty state placeholder */
  document.getElementById('emptyState').style.display = 'none';

  const colorMap = buildColorMap(gantt);

  renderGantt(gantt, colorMap);
  renderStats(results, colorMap, showPrio);
  renderAverages(results);
}
