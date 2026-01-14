import "./src/calc.js"; // attaches window.Calc

const el = id => document.getElementById(id);

const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

const form = el('calcForm');
const startDate = el('startDate');
const endDate = el('endDate');
const principal = el('principal');
const monthlyRate = el('monthlyRate');
const calculateBtn = el('calculateBtn');
const resetBtn = el('resetBtn');
const installBtn = el('installBtn');
const resultsCard = el('results');
const monthsWholeEl = el('monthsWhole');
const monthsDecimalEl = el('monthsDecimal');
const principalFmt = el('principalFmt');
const interestFmt = el('interestFmt');
const totalFmt = el('totalFmt');
const breakdownDetails = el('breakdownDetails');
const breakdownTableBody = el('breakdownTable').querySelector('tbody');

const startDateError = el('startDateError');
const endDateError = el('endDateError');
const principalError = el('principalError');
const rateError = el('rateError');

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

function showError(el, msg) {
  el.textContent = msg || '';
}

function validateInputs(s, e, p, r) {
  let ok = true;
  showError(startDateError, '');
  showError(endDateError, '');
  showError(principalError, '');
  showError(rateError, '');
  if (!s) { showError(startDateError, 'Start date required'); ok = false; }
  if (!e) { showError(endDateError, 'End date required'); ok = false; }
  if (s && e && new Date(s) >= new Date(e)) { showError(endDateError, 'End must be after start'); ok = false; }
  if (!p || Number(p) <= 0) { showError(principalError, 'Principal must be > 0'); ok = false; }
  if (r === '' || r === null || r === undefined || Number(r) < 0) { showError(rateError, 'Rate must be >= 0'); ok = false; }
  return ok;
}

function renderBreakdown(rows) {
  breakdownTableBody.innerHTML = '';
  rows.forEach(row => {
    const tr = document.createElement('tr');
    const tdIdx = document.createElement('td'); tdIdx.textContent = row.index;
    const tdPeriod = document.createElement('td'); tdPeriod.textContent = row.period;
    const tdInterest = document.createElement('td'); tdInterest.textContent = fmt.format(row.interest);
    tr.append(tdIdx, tdPeriod, tdInterest);
    breakdownTableBody.appendChild(tr);
  });
}

function showResults(principalVal, monthlyRateVal, monthsDecimalVal, interestVal) {
  monthsDecimalEl.textContent = monthsDecimalVal.toFixed(2);
  monthsWholeEl.textContent = Math.floor(monthsDecimalVal);
  principalFmt.textContent = fmt.format(principalVal);
  interestFmt.textContent = fmt.format(interestVal);
  totalFmt.textContent = fmt.format(principalVal + interestVal);
  renderBreakdown(window.Calc.breakdown(principalVal, monthlyRateVal, monthsDecimalVal));
  resultsCard.hidden = false;
  breakdownDetails.hidden = false;
}

calculateBtn.addEventListener('click', () => {
  const s = startDate.value;
  const e = endDate.value;
  const p = parseFloat(principal.value);
  const r = parseFloat(monthlyRate.value);
  if (!validateInputs(s, e, p, r)) return;
  const md = window.Calc.monthsDecimal(s, e);
  const interest = Number(window.Calc.computeInterestSimple(p, r, md).toFixed(2));
  showResults(p, r, md, interest);
  // store last used
  try { localStorage.setItem('lastInputs', JSON.stringify({ s, e, p, r })); } catch (err) {}
});

resetBtn.addEventListener('click', () => {
  form.reset();
  resultsCard.hidden = true;
  breakdownDetails.hidden = true;
  showError(startDateError, '');
  showError(endDateError, '');
  showError(principalError, '');
  showError(rateError, '');
});

// restore last inputs
(function restore() {
  try {
    const raw = localStorage.getItem('lastInputs');
    if (!raw) return;
    const { s, e, p, r } = JSON.parse(raw);
    startDate.value = s; endDate.value = e; principal.value = p; monthlyRate.value = r;
  } catch (err) {}
})();

// register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // ignore
    });
  });
}

// small accessibility: press Enter on inputs triggers calculate
form.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter') { ev.preventDefault(); calculateBtn.click(); }
});