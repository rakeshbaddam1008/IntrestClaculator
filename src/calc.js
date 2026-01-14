// Calculation helpers usable in browser and Node (for tests)
/* eslint-disable no-undef */

const DAYS_PER_MONTH_AVG = 30.4375;

function daysBetween(start, end) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e - s) / msPerDay);
}

function monthsDecimal(start, end) {
  const days = daysBetween(start, end);
  return Number((days / DAYS_PER_MONTH_AVG).toFixed(4));
}

function computeInterestSimple(principal, monthlyRatePercent, monthsDecimalVal) {
  const rate = monthlyRatePercent / 100;
  return principal * rate * monthsDecimalVal;
}

function breakdown(principal, monthlyRatePercent, monthsDecimalVal) {
  const whole = Math.floor(monthsDecimalVal);
  const frac = Number((monthsDecimalVal - whole).toFixed(6));
  const perMonth = principal * (monthlyRatePercent / 100);
  const rows = [];
  for (let i = 1; i <= whole; i++) {
    rows.push({index: i, period: 'Full month', interest: Number(perMonth.toFixed(2))});
  }
  if (frac > 0) {
    rows.push({index: whole + 1, period: `${(frac * 100).toFixed(2)}% (fraction)`, interest: Number((perMonth * frac).toFixed(2))});
  }
  return rows;
}

// expose for Node & browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { daysBetween, monthsDecimal, computeInterestSimple, breakdown };
} else {
  window.Calc = { daysBetween, monthsDecimal, computeInterestSimple, breakdown };
}