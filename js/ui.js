/**
 * js/ui.js
 * ─────────────────────────────────────────────
 * UI layer: handles all user interaction with the
 * left configuration panel.
 *
 * Responsibilities:
 *   - Show/hide the Priority Mode sub-dropdown
 *   - Generate dynamic process input rows
 *   - Read process data from the DOM
 *   - Build the Time Quantum input section
 *
 * Does NOT run algorithms or touch the output panel —
 * that is handled by main.js and renderer.js.
 */

/* ── DOM references ── */
const algoSelect       = document.getElementById('algorithm');
const priorityModeWrap = document.getElementById('priorityModeWrap');
const confirmButton    = document.getElementById('confirmButton');
const calcBtn          = document.getElementById('calcBtn');
const inputFieldsEl    = document.getElementById('inputFields');

/* ────────────────────────────────────────
  Algorithm-type helpers
  Used by both ui.js and main.js
──────────────────────────────────────── */

/** Returns true when the selected algorithm uses priority values */
function needsPriority() {
return ['priority', 'priority_rr'].includes(algoSelect.value);
}

/** Returns true when the selected algorithm uses a time quantum */
function needsTimeQuantum() {
return ['round_robin', 'priority_rr'].includes(algoSelect.value);
}

/** Reads and returns the time quantum input value (default 2) */
function getTimeQuantum() {
return parseInt(document.getElementById('timeQuantum')?.value) || 2;
}

/* ────────────────────────────────────────
  handleAlgoChange()
  Called whenever the algorithm dropdown changes.
  Shows/hides the Priority Mode sub-dropdown and
  regenerates input rows if they already exist.
──────────────────────────────────────── */
function handleAlgoChange() {
const isPriority = algoSelect.value === 'priority';

/* Toggle sub-dropdown visibility and ARIA attribute */
priorityModeWrap.style.display    = isPriority ? 'block' : 'none';
priorityModeWrap.setAttribute('aria-hidden', String(!isPriority));

/* Re-generate rows live if a table already exists */
if (document.getElementById('processTable')) generateInputs();
}

/* ────────────────────────────────────────
  generateInputs()
  Builds the process input table inside #inputFields.
  Columns: PID | Arrival | Burst [| Priority]
  Appends a Time Quantum row for RR-based algorithms.
──────────────────────────────────────── */
function generateInputs() {
const n = parseInt(document.getElementById('numOfInputs').value);

if (!n || n < 1 || n > 20) {
  alert('Please enter a number between 1 and 20.');
  return;
}

/* Clear any previous table */
inputFieldsEl.innerHTML = '';
calcBtn.classList.add('visible');

const withPrio = needsPriority();
const withTQ   = needsTimeQuantum();

/* Grid column definition: 3 columns normally, 4 with priority */
const gridCols = withPrio ? '40px 1fr 1fr 1fr' : '40px 1fr 1fr';

/* ── Table container ── */
const table = document.createElement('div');
table.className = 'process-table visible';
table.id = 'processTable';

/* ── Column header ── */
const header = document.createElement('div');
header.className = 'table-header';
header.style.gridTemplateColumns = gridCols;
header.innerHTML = withPrio
  ? '<span>PID</span><span>ARRIVAL</span><span>BURST</span><span>PRIO</span>'
  : '<span>PID</span><span>ARRIVAL</span><span>BURST</span>';
table.appendChild(header);

/* ── One row per process ── */
for (let i = 0; i < n; i++) {
  const row = document.createElement('div');
  row.className = 'process-row';
  row.style.gridTemplateColumns = gridCols;
  row.style.animationDelay = `${i * 0.04}s`; /* staggered entry */

  row.innerHTML = `
    <div class="pid-label">P${i + 1}</div>
    <input type="number" class="arrival"  min="0" placeholder="0">
    <input type="number" class="burst"    min="1" placeholder="1">
    ${withPrio ? '<input type="number" class="priority" min="0" placeholder="0">' : ''}
  `;
  table.appendChild(row);
}

/* ── Optional Time Quantum input ── */
if (withTQ) table.appendChild(buildTQSection());

inputFieldsEl.appendChild(table);
}

/**
 * buildTQSection()
 * Creates the Time Quantum input DOM node.
 * Appended at the bottom of the process table.
 *
 * @returns {HTMLElement}
 */
function buildTQSection() {
const div = document.createElement('div');
div.className = 'tq-section';
div.id = 'tqSection';
div.innerHTML = `
  <label>&#8635; Time Quantum</label>
  <input type="number" id="timeQuantum" min="1" placeholder="e.g. 2">
`;
return div;
}

/* ────────────────────────────────────────
  getProcesses()
  Reads all process input rows from the DOM
  and returns a clean process array.

  Output shape per process:
  { pid, arrival, burst, remaining, priority }
──────────────────────────────────────── */
function getProcesses() {
return Array.from(document.querySelectorAll('.process-row')).map((row, i) => {
  const burst   = parseInt(row.querySelector('.burst').value)    || 1;
  const prioEl  = row.querySelector('.priority');
  const arrival = parseInt(row.querySelector('.arrival').value)  || 0;

  return {
    pid:      `P${i + 1}`,
    arrival,
    burst,
    remaining: burst,         /* used by preemptive algorithms */
    priority: prioEl ? (parseInt(prioEl.value) || 0) : 0
  };
});
}

/* ── Event listeners ── */
algoSelect.addEventListener('change', handleAlgoChange);
confirmButton.addEventListener('click', generateInputs);
