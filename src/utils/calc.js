// All numbers are derived from entries the user logged. Nothing is assumed or faked.
const DAY = 86400000;
export const today = () => new Date().toISOString().slice(0, 10);
export const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s));
export const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / DAY);
export const num = (v) => (v === '' || v == null ? NaN : Number(v));

// Full-tank method: km/l is only computed between two full-tank fills.
export function withMileage(fuel) {
  const sorted = [...fuel].sort((a, b) => a.odo - b.odo);
  let lastFull = null, litres = 0;
  return sorted.map((e) => {
    let kmpl = null, km = null, lt = null;
    if (lastFull) {
      litres += e.litres;
      if (e.full) { km = e.odo - lastFull.odo; lt = litres; kmpl = km / lt; }
    }
    if (e.full) { lastFull = e; litres = 0; }
    return { ...e, kmpl, km, lt };
  }).reverse();
}

export function avgMileage(rows) {
  const valid = rows.filter((r) => r.kmpl);
  const km = valid.reduce((s, r) => s + r.km, 0);
  const lt = valid.reduce((s, r) => s + r.lt, 0);
  return lt ? km / lt : null;
}

export const currentOdo = (fuel, service) => {
  const all = [...fuel.map((f) => f.odo), ...service.map((s) => s.lastKm)];
  return all.length ? Math.max(...all) : null;
};

export function serviceStatus(s, odo) {
  const kmLeft = s.intervalKm && odo != null ? s.lastKm + s.intervalKm - odo : null;
  const daysLeft = s.intervalDays ? s.intervalDays - daysBetween(s.lastDate, today()) : null;
  const due = (kmLeft != null && kmLeft <= 0) || (daysLeft != null && daysLeft <= 0);
  const soon = (kmLeft != null && kmLeft <= 200) || (daysLeft != null && daysLeft <= 14);
  return { kmLeft, daysLeft, due, soon };
}
