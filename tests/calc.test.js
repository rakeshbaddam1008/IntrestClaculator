const { daysBetween, monthsDecimal, computeInterestSimple } = require('../src/calc');

describe('calc helpers', () => {
  test('daysBetween simple', () => {
    expect(daysBetween('2026-01-01', '2026-04-01')).toBe(90);
  });

  test('monthsDecimal example 1', () => {
    const md = monthsDecimal('2026-01-01', '2026-04-01');
    expect(Number(md.toFixed(2))).toBeCloseTo(3.00, 2);
  });

  test('example 1 interest', () => {
    const md = monthsDecimal('2026-01-01', '2026-04-01');
    const interest = computeInterestSimple(10000, 1, md);
    expect(Number(interest.toFixed(2))).toBeCloseTo(300.00, 2);
  });

  test('example 2 fractional', () => {
    const md = monthsDecimal('2026-01-15', '2026-03-01');
    expect(Number(md.toFixed(2))).toBeCloseTo(1.48, 2);
    const interest = computeInterestSimple(5000, 1.5, md);
    expect(Number(interest.toFixed(0))).toBeCloseTo(111, 0);
  });

  test('validation edge: same day monthsDecimal=0', () => {
    expect(monthsDecimal('2026-01-01','2026-01-01')).toBe(0);
  });
});