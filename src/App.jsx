import { useState, useEffect, useReducer } from "react";

const PRODUCT_CATEGORIES = [
  "Haircut", "Beard Trim", "Shave", "Hair Color", "Hair Treatment",
  "Product Sale", "Kids Cut", "Style/Blowout", "Other Service"
];

const EXPENSE_CATEGORIES = [
  "Rent/Booth Fee", "Supplies", "Equipment", "Marketing",
  "Insurance", "Licensing", "Utilities", "Product Inventory",
  "Continuing Education", "Other"
];

let _idCounter = 0;
function generateId() {
  _idCounter++;
  return Date.now().toString(36) + _idCounter.toString(36) + Math.random().toString(36).slice(2, 7);
}

function getWeekNumber(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return Math.round(((date - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7) + 1;
}

function getWeekRange(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    end: sunday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
}

function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function reducer(state, action) {
  switch (action.type) {
    case "LOAD": return { ...state, ...action.payload };
    case "RESET": return { incomeEntries: [], expenseEntries: [] };
    case "ADD_INCOME": return { ...state, incomeEntries: [...state.incomeEntries, action.payload] };
    case "ADD_EXPENSE": return { ...state, expenseEntries: [...state.expenseEntries, action.payload] };
    case "DELETE_INCOME": return { ...state, incomeEntries: state.incomeEntries.filter((e) => e.id !== action.id) };
    case "DELETE_EXPENSE": return { ...state, expenseEntries: state.expenseEntries.filter((e) => e.id !== action.id) };
    default: return state;
  }
}

function generateSampleData() {
  const clients = ["Marcus J.", "Dre W.", "Tony S.", "Lil Mike", "Jerome B.", "Carlos R.", "DJ Fresh", "Big Ray", "Terrence H.", "Andre P.", "Malik D.", "Corey T.", "Rashad K.", "Dwayne F.", "Jamal G."];
  const notes = ["Regular", "Walk-in", "Referral from Dre", "First time", "VIP client", "Tipped extra", "", "", ""];
  const income = []; const expenses = [];
  const startDate = new Date(2026, 1, 1); const endDate = new Date(2026, 2, 15);
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay(); if (dow === 0) continue;
    const dateStr = d.toISOString().split("T")[0];
    const numClients = dow === 6 ? Math.floor(Math.random() * 5) + 6 : Math.floor(Math.random() * 4) + 3;
    for (let c = 0; c < numClients; c++) {
      const rand = Math.random(); let category, amount;
      if (rand < 0.45) { category = "Haircut"; amount = [30, 35, 40, 45][Math.floor(Math.random() * 4)]; }
      else if (rand < 0.65) { category = "Beard Trim"; amount = [15, 20, 25][Math.floor(Math.random() * 3)]; }
      else if (rand < 0.75) { category = "Haircut"; amount = 55; }
      else if (rand < 0.82) { category = "Kids Cut"; amount = [18, 20, 22][Math.floor(Math.random() * 3)]; }
      else if (rand < 0.88) { category = "Shave"; amount = [25, 30, 35][Math.floor(Math.random() * 3)]; }
      else if (rand < 0.93) { category = "Product Sale"; amount = [12, 18, 22, 28, 35][Math.floor(Math.random() * 5)]; }
      else if (rand < 0.97) { category = "Hair Color"; amount = [60, 75, 85][Math.floor(Math.random() * 3)]; }
      else { category = "Style/Blowout"; amount = [35, 40, 50][Math.floor(Math.random() * 3)]; }
      income.push({ id: generateId(), date: dateStr, category, amount, client: clients[Math.floor(Math.random() * clients.length)], note: notes[Math.floor(Math.random() * notes.length)] });
    }
  }
  [1, 2].forEach((m) => {
    const mStr = `2026-${String(m + 1).padStart(2, "0")}`;
    expenses.push({ id: generateId(), date: `${mStr}-01`, category: "Rent/Booth Fee", amount: 600, note: `${m === 1 ? "Feb" : "Mar"} booth rent`, client: "" });
    expenses.push({ id: generateId(), date: `${mStr}-01`, category: "Insurance", amount: 85, note: "Liability insurance", client: "" });
    expenses.push({ id: generateId(), date: `${mStr}-05`, category: "Utilities", amount: 45, note: "Shop utilities share", client: "" });
  });
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
    const dateStr = d.toISOString().split("T")[0];
    expenses.push({ id: generateId(), date: dateStr, category: "Supplies", amount: [25, 32, 40, 28, 35][Math.floor(Math.random() * 5)], note: "Blades, capes, towels", client: "" });
    if (Math.random() > 0.5) expenses.push({ id: generateId(), date: dateStr, category: "Product Inventory", amount: [45, 60, 80, 55][Math.floor(Math.random() * 4)], note: "Pomade & oils restock", client: "" });
  }
  expenses.push({ id: generateId(), date: "2026-02-10", category: "Equipment", amount: 189, note: "New Wahl clippers", client: "" });
  expenses.push({ id: generateId(), date: "2026-02-18", category: "Marketing", amount: 50, note: "Instagram boost", client: "" });
  expenses.push({ id: generateId(), date: "2026-03-05", category: "Marketing", amount: 75, note: "Business cards & flyers", client: "" });
  expenses.push({ id: generateId(), date: "2026-03-10", category: "Continuing Education", amount: 120, note: "Fade mastery workshop", client: "" });
  return { incomeEntries: income, expenseEntries: expenses };
}

const DEMO_DATA = generateSampleData();
const initialState = { incomeEntries: DEMO_DATA.incomeEntries, expenseEntries: DEMO_DATA.expenseEntries };

async function loadData() { try { const r = localStorage.getItem("barber-pnl-data"); if (r) return JSON.parse(r); } catch(e){} return null; }
async function loadOnboarded() { try { const r = localStorage.getItem("barber-pnl-onboarded"); if (r) return JSON.parse(r); } catch(e){} return false; }
async function saveData(s) { try { localStorage.setItem("barber-pnl-data", JSON.stringify({ incomeEntries: s.incomeEntries, expenseEntries: s.expenseEntries })); } catch(e){} }
async function saveOnboarded(v) { try { localStorage.setItem("barber-pnl-onboarded", JSON.stringify(v)); } catch(e){} }

const Icons = {
  Scissors: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
  Trash: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Chart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ArrowUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  ArrowDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Reset: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  Gear: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

const C = {
  bg: "#0D0F0E", card: "#161A18", border: "#2A2F2C",
  accent: "#C8A96E", green: "#4ADE80", greenDim: "rgba(74,222,128,0.12)",
  red: "#F87171", redDim: "rgba(248,113,113,0.12)",
  text: "#E8E6E1", textMuted: "#8A8780", textDim: "#5C5A55",
};
const fd = "'Playfair Display', Georgia, serif";
const fb = "'DM Sans', 'Segoe UI', sans-serif";

function MiniBar({ data, maxVal, color }) {
  const m = maxVal || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
      {data.map((v, i) => <div key={i} style={{ flex: 1, minWidth: 6, maxWidth: 28, height: `${Math.max((v / m) * 100, 4)}%`, background: color, borderRadius: "3px 3px 0 0", transition: "height 0.4s ease" }} title={formatCurrency(v)} />)}
    </div>
  );
}

// ══════════════════════════
// ONBOARDING
// ══════════════════════════
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: "✂️", title: "Welcome to BarberBooks", desc: "The simplest way for barbers to track income, expenses, and know exactly where your money goes." },
    { icon: "💰", title: "Log Sales & Expenses", desc: "Quickly add each service, product sale, or business expense as it happens. Categorize everything with one tap." },
    { icon: "📊", title: "Weekly & Monthly P&L", desc: "Automatically generated Profit & Loss reports break down your revenue, costs, and net profit at a glance." },
    { icon: "📤", title: "Export Your Data", desc: "Download reports as CSV files anytime — perfect for your records, taxes, or sharing with an accountant." },
  ];
  const s = steps[step]; const last = step === steps.length - 1;
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: fb, color: C.text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", gap: 8, marginBottom: 48 }}>
        {steps.map((_, i) => <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? C.accent : C.border, transition: "all 0.3s ease" }} />)}
      </div>
      <div key={step} style={{ animation: "fadeUp 0.4s ease" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>{s.icon}</div>
        <h1 style={{ fontFamily: fd, fontSize: 28, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.02em" }}>{s.title}</h1>
        <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, maxWidth: 320, margin: "0 auto 48px" }}>{s.desc}</p>
      </div>
      <button onClick={() => last ? onDone() : setStep(step + 1)} style={{
        padding: "16px 48px", borderRadius: 12, border: "none", cursor: "pointer",
        fontSize: 16, fontWeight: 700, fontFamily: fb, background: C.accent, color: C.bg,
      }}>{last ? "Let's Go!" : "Next"}</button>
      {!last && <button onClick={onDone} style={{ background: "none", border: "none", color: C.textDim, fontSize: 13, marginTop: 16, cursor: "pointer", fontFamily: fb }}>Skip intro</button>}
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ══════════════════════════
// MAIN APP
// ══════════════════════════
export default function BarberPnL() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [view, setView] = useState("monthly");
  const [entryType, setEntryType] = useState("income");
  const [loaded, setLoaded] = useState(false);
  const [onboarded, setOnboarded] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [formDate, setFormDate] = useState(today);
  const [formCategory, setFormCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [formAmount, setFormAmount] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formClient, setFormClient] = useState("");

  useEffect(() => {
    Promise.all([loadData(), loadOnboarded()]).then(([d, ob]) => {
      if (d && (d.incomeEntries?.length > 0 || d.expenseEntries?.length > 0)) dispatch({ type: "LOAD", payload: d });
      setOnboarded(!!ob);
      setLoaded(true);
    });
  }, []);
  useEffect(() => { if (loaded) saveData(state); }, [state, loaded]);
  useEffect(() => { setFormCategory(entryType === "income" ? PRODUCT_CATEGORIES[0] : EXPENSE_CATEGORIES[0]); }, [entryType]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const handleOnboard = () => { setOnboarded(true); saveOnboarded(true); };

  function handleSubmit() {
    const amt = parseFloat(formAmount);
    if (!amt || amt <= 0) { showToast("⚠️ Enter a valid amount"); return; }
    dispatch({ type: entryType === "income" ? "ADD_INCOME" : "ADD_EXPENSE", payload: { id: generateId(), date: formDate, category: formCategory, amount: amt, note: formNote, client: formClient } });
    setFormAmount(""); setFormNote(""); setFormClient("");
    showToast(entryType === "income" ? "💰 Income added!" : "📝 Expense added!");
  }

  function handleDelete(type, id) { dispatch({ type: type === "income" ? "DELETE_INCOME" : "DELETE_EXPENSE", id }); setConfirmDelete(null); showToast("Deleted"); }
  function handleReset() { dispatch({ type: "RESET" }); setConfirmReset(false); setShowSettings(false); showToast("All data cleared!"); }

  // ── CSV Export ──
  function exportCSV(reportType) {
    let csv = "";
    if (reportType === "all") {
      csv = "Type,Date,Category,Amount,Client,Note\n";
      state.incomeEntries.forEach((e) => { csv += `Income,${e.date},"${e.category}",${e.amount.toFixed(2)},"${e.client || ""}","${e.note || ""}"\n`; });
      state.expenseEntries.forEach((e) => { csv += `Expense,${e.date},"${e.category}",${e.amount.toFixed(2)},"","${e.note || ""}"\n`; });
    } else if (reportType === "weekly") {
      csv = "Week,Week Range,Total Revenue,Total Expenses,Net Profit,Margin %\n";
      buildWeeklyData().forEach(([key, d]) => { const p = d.income - d.expenses; const mg = d.income > 0 ? ((p / d.income) * 100).toFixed(1) : "0.0"; const r = getWeekRange(d.dateExample); csv += `${key},"${r.start} - ${r.end}",${d.income.toFixed(2)},${d.expenses.toFixed(2)},${p.toFixed(2)},${mg}\n`; });
    } else {
      csv = "Month,Total Revenue,Total Expenses,Net Profit,Margin %\n";
      buildMonthlyData().forEach(([key, d]) => { const p = d.income - d.expenses; const mg = d.income > 0 ? ((p / d.income) * 100).toFixed(1) : "0.0"; const [yr, mo] = key.split("-"); csv += `"${new Date(+yr, +mo - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}",${d.income.toFixed(2)},${d.expenses.toFixed(2)},${p.toFixed(2)},${mg}\n`; });
      csv += "\nMonth,Type,Category,Amount\n";
      buildMonthlyData().forEach(([key, d]) => { const [yr, mo] = key.split("-"); const nm = new Date(+yr, +mo - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }); Object.entries(d.incomeByCategory).forEach(([cat, amt]) => { csv += `"${nm}",Revenue,"${cat}",${amt.toFixed(2)}\n`; }); Object.entries(d.expenseByCategory).forEach(([cat, amt]) => { csv += `"${nm}",Expense,"${cat}",${amt.toFixed(2)}\n`; }); });
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `barberbooks-${reportType}-${today}.csv`; a.click(); URL.revokeObjectURL(url);
    showToast("📁 CSV downloaded!");
  }

  // ── P&L calculations ──
  function buildWeeklyData() {
    const weeks = {};
    [...state.incomeEntries, ...state.expenseEntries].forEach((e) => {
      const yr = new Date(e.date + "T00:00:00").getFullYear(); const wk = getWeekNumber(e.date);
      const key = `${yr}-W${String(wk).padStart(2, "0")}`;
      if (!weeks[key]) weeks[key] = { income: 0, expenses: 0, incomeByCategory: {}, expenseByCategory: {}, dateExample: e.date };
      const isInc = state.incomeEntries.some((ie) => ie.id === e.id);
      if (isInc) { weeks[key].income += e.amount; weeks[key].incomeByCategory[e.category] = (weeks[key].incomeByCategory[e.category] || 0) + e.amount; }
      else { weeks[key].expenses += e.amount; weeks[key].expenseByCategory[e.category] = (weeks[key].expenseByCategory[e.category] || 0) + e.amount; }
    });
    return Object.entries(weeks).sort((a, b) => b[0].localeCompare(a[0]));
  }
  function buildMonthlyData() {
    const months = {};
    [...state.incomeEntries, ...state.expenseEntries].forEach((e) => {
      const d = new Date(e.date + "T00:00:00"); const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) months[key] = { income: 0, expenses: 0, incomeByCategory: {}, expenseByCategory: {} };
      const isInc = state.incomeEntries.some((ie) => ie.id === e.id);
      if (isInc) { months[key].income += e.amount; months[key].incomeByCategory[e.category] = (months[key].incomeByCategory[e.category] || 0) + e.amount; }
      else { months[key].expenses += e.amount; months[key].expenseByCategory[e.category] = (months[key].expenseByCategory[e.category] || 0) + e.amount; }
    });
    return Object.entries(months).sort((a, b) => b[0].localeCompare(a[0]));
  }

  const totalIncome = state.incomeEntries.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = state.expenseEntries.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  if (!loaded || onboarded === null) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fb, color: C.textMuted }}>Loading...</div>;
  if (!onboarded) return <Onboarding onDone={handleOnboard} />;

  const ExportBtn = ({ label, onClick }) => (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.accent, fontSize: 12, fontWeight: 600, fontFamily: fb, cursor: "pointer" }}>
      <Icons.Download />{label}
    </button>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: fb, color: C.text, position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {toast && <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 500, color: C.accent, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "fadeIn 0.3s ease" }}>{toast}</div>}

      {/* ── Settings Modal ── */}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} onClick={() => { setShowSettings(false); setConfirmReset(false); }} />
          <div style={{ position: "relative", background: C.card, borderRadius: 16, padding: 24, width: "100%", maxWidth: 360, border: `1px solid ${C.border}` }}>
            <h3 style={{ fontFamily: fd, fontSize: 20, fontWeight: 700, margin: "0 0 20px", color: C.text }}>Settings</h3>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Export Data</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <ExportBtn label="All Entries (CSV)" onClick={() => exportCSV("all")} />
                <ExportBtn label="Weekly P&L Report" onClick={() => exportCSV("weekly")} />
                <ExportBtn label="Monthly P&L Report" onClick={() => exportCSV("monthly")} />
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
              <div style={{ fontSize: 11, color: C.red, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Danger Zone</div>
              {!confirmReset ? (
                <button onClick={() => setConfirmReset(true)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.red, fontSize: 14, fontWeight: 600, fontFamily: fb, cursor: "pointer" }}>
                  <Icons.Reset /> Clear All Data & Start Fresh
                </button>
              ) : (
                <div style={{ background: C.redDim, borderRadius: 10, padding: 16, border: "1px solid rgba(248,113,113,0.3)" }}>
                  <p style={{ fontSize: 13, color: C.red, margin: "0 0 12px", fontWeight: 500 }}>This will permanently delete all your income and expense entries. This cannot be undone.</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleReset} style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", cursor: "pointer", background: C.red, color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: fb }}>Yes, Delete Everything</button>
                    <button onClick={() => setConfirmReset(false)} style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", background: C.card, color: C.textMuted, fontSize: 13, fontWeight: 600, fontFamily: fb }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => { setShowSettings(false); setConfirmReset(false); }} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, fontSize: 14, fontWeight: 600, fontFamily: fb, cursor: "pointer", marginTop: 16 }}>Close</button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, #131715 0%, ${C.bg} 100%)`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ color: C.accent }}><Icons.Scissors /></div>
            <h1 style={{ fontFamily: fd, fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.02em", color: C.text }}>Barber<span style={{ color: C.accent }}>Books</span></h1>
          </div>
          <p style={{ fontSize: 13, color: C.textMuted, margin: 0, marginLeft: 32 }}>Track your hustle. Know your numbers.</p>
        </div>
        <button onClick={() => setShowSettings(true)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, cursor: "pointer", color: C.textMuted, marginTop: 4 }}>
          <Icons.Gear />
        </button>
      </div>

      {/* ── Summary ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "16px 16px 8px" }}>
        {[{ l: "Revenue", v: totalIncome, c: C.green }, { l: "Expenses", v: totalExpenses, c: C.red }, { l: "Net Profit", v: netProfit, c: netProfit >= 0 ? C.green : C.red }].map((x, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: "14px 12px", border: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: x.c, opacity: 0.6 }} />
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{x.l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: fd, color: x.c }}>{formatCurrency(x.v)}</div>
          </div>
        ))}
      </div>

      {/* ── Nav ── */}
      <div style={{ display: "flex", gap: 4, padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
        {[{ id: "entry", label: "Add Entry", icon: <Icons.Plus /> }, { id: "weekly", label: "Weekly P&L", icon: <Icons.Calendar /> }, { id: "monthly", label: "Monthly P&L", icon: <Icons.Chart /> }].map((tab) => (
          <button key={tab.id} onClick={() => setView(tab.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: fb, background: view === tab.id ? C.accent : "transparent", color: view === tab.id ? C.bg : C.textMuted, transition: "all 0.2s ease" }}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: 16, maxWidth: 700, margin: "0 auto" }}>

        {/* ADD ENTRY */}
        {view === "entry" && (
          <div>
            <div style={{ display: "flex", background: C.card, borderRadius: 12, padding: 4, marginBottom: 20, border: `1px solid ${C.border}` }}>
              {["income", "expense"].map((t) => (
                <button key={t} onClick={() => setEntryType(t)} style={{ flex: 1, padding: "12px 16px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: fb, transition: "all 0.2s", background: entryType === t ? (t === "income" ? C.green : C.red) : "transparent", color: entryType === t ? C.bg : C.textMuted }}>
                  {t === "income" ? "💰 Income / Sales" : "📋 Expenses"}
                </button>
              ))}
            </div>

            <div style={{ background: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Date</label>
                  <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Amount ($)</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} style={{ ...inp, color: C.accent, fontSize: 18, fontWeight: 700, fontFamily: fd }} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Category</label>
                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} style={inp}>
                  {(entryType === "income" ? PRODUCT_CATEGORIES : EXPENSE_CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {entryType === "income" && <div style={{ marginBottom: 14 }}><label style={lbl}>Client Name (optional)</label><input value={formClient} onChange={(e) => setFormClient(e.target.value)} placeholder="e.g. Marcus J." style={inp} /></div>}
              <div style={{ marginBottom: 18 }}><label style={lbl}>Note (optional)</label><input value={formNote} onChange={(e) => setFormNote(e.target.value)} placeholder="Quick note..." style={inp} /></div>
              <button onClick={handleSubmit} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: fb, background: entryType === "income" ? C.green : C.red, color: C.bg }}>
                {entryType === "income" ? "Add Income" : "Add Expense"}
              </button>
            </div>

            <h3 style={{ fontFamily: fd, fontSize: 18, fontWeight: 600, marginBottom: 12, color: C.accent, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Recent Entries</span>
              {(state.incomeEntries.length > 0 || state.expenseEntries.length > 0) && <ExportBtn label="CSV" onClick={() => exportCSV("all")} />}
            </h3>
            {[...state.incomeEntries.map((e) => ({ ...e, _t: "income" })), ...state.expenseEntries.map((e) => ({ ...e, _t: "expense" }))]
              .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 20).map((entry) => (
                <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: C.card, borderRadius: 10, marginBottom: 6, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: entry._t === "income" ? C.greenDim : C.redDim, color: entry._t === "income" ? C.green : C.red, flexShrink: 0 }}>
                    {entry._t === "income" ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{entry.category}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}{entry.client && ` · ${entry.client}`}{entry.note && ` · ${entry.note}`}
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: fd, color: entry._t === "income" ? C.green : C.red, flexShrink: 0 }}>
                    {entry._t === "income" ? "+" : "−"}{formatCurrency(entry.amount)}
                  </div>
                  <button onClick={() => confirmDelete?.id === entry.id ? handleDelete(entry._t, entry.id) : setConfirmDelete(entry)} style={{ background: confirmDelete?.id === entry.id ? C.red : "transparent", border: "none", cursor: "pointer", color: confirmDelete?.id === entry.id ? "#fff" : C.textDim, padding: 6, borderRadius: 6, flexShrink: 0 }}>
                    <Icons.Trash />
                  </button>
                </div>
              ))}
            {state.incomeEntries.length === 0 && state.expenseEntries.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.textMuted, fontSize: 14 }}>No entries yet. Start adding your income and expenses above!</div>}
          </div>
        )}

        {/* WEEKLY P&L */}
        {view === "weekly" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: fd, fontSize: 20, fontWeight: 700, margin: 0, color: C.text }}>Weekly P&L <span style={{ color: C.accent }}>Report</span></h3>
              {buildWeeklyData().length > 0 && <ExportBtn label="Export" onClick={() => exportCSV("weekly")} />}
            </div>
            {buildWeeklyData().length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.textMuted, fontSize: 14 }}>No data yet.</div>}
            {buildWeeklyData().map(([wk, data]) => {
              const p = data.income - data.expenses; const r = getWeekRange(data.dateExample);
              const mg = data.income > 0 ? ((p / data.income) * 100).toFixed(1) : "0.0";
              return (
                <div key={wk} style={{ background: C.card, borderRadius: 14, padding: 18, marginBottom: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div><div style={{ fontSize: 15, fontWeight: 700, fontFamily: fd, color: C.text }}>{r.start} – {r.end}</div><div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{wk}</div></div>
                    <div style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: p >= 0 ? C.greenDim : C.redDim, color: p >= 0 ? C.green : C.red }}>{mg}% margin</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[{ l: "Revenue", v: data.income, c: C.green }, { l: "Expenses", v: data.expenses, c: C.red }, { l: "Net Profit", v: p, c: p >= 0 ? C.green : C.red }].map((x) => (
                      <div key={x.l}><div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em" }}>{x.l}</div><div style={{ fontSize: 17, fontWeight: 700, fontFamily: fd, color: x.c }}>{formatCurrency(x.v)}</div></div>
                    ))}
                  </div>
                  {Object.keys(data.incomeByCategory).length > 0 && <div style={{ marginBottom: 10 }}><div style={catHdr}>Income Breakdown</div>{Object.entries(data.incomeByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => <div key={cat} style={catRow}><span style={{ color: C.textMuted }}>{cat}</span><span style={{ color: C.green, fontWeight: 600 }}>{formatCurrency(amt)}</span></div>)}</div>}
                  {Object.keys(data.expenseByCategory).length > 0 && <div><div style={catHdr}>Expense Breakdown</div>{Object.entries(data.expenseByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => <div key={cat} style={catRow}><span style={{ color: C.textMuted }}>{cat}</span><span style={{ color: C.red, fontWeight: 600 }}>{formatCurrency(amt)}</span></div>)}</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* MONTHLY P&L */}
        {view === "monthly" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: fd, fontSize: 20, fontWeight: 700, margin: 0, color: C.text }}>Monthly P&L <span style={{ color: C.accent }}>Report</span></h3>
              {buildMonthlyData().length > 0 && <ExportBtn label="Export" onClick={() => exportCSV("monthly")} />}
            </div>

            {buildMonthlyData().length > 1 && (() => {
              const sorted = [...buildMonthlyData()].reverse();
              const iv = sorted.map(([, d]) => d.income); const ev = sorted.map(([, d]) => d.expenses);
              const mx = Math.max(...iv, ...ev, 1);
              return (
                <div style={{ background: C.card, borderRadius: 14, padding: 18, marginBottom: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Revenue vs Expenses Trend</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ flex: 1 }}><MiniBar data={iv} maxVal={mx} color={C.green} /><div style={{ fontSize: 10, color: C.green, marginTop: 4, textAlign: "center", fontWeight: 600 }}>Revenue</div></div>
                    <div style={{ flex: 1 }}><MiniBar data={ev} maxVal={mx} color={C.red} /><div style={{ fontSize: 10, color: C.red, marginTop: 4, textAlign: "center", fontWeight: 600 }}>Expenses</div></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: C.textDim }}>
                    {sorted.map(([key]) => { const [y, m] = key.split("-"); return <span key={key}>{new Date(+y, +m - 1).toLocaleDateString("en-US", { month: "short" })}</span>; })}
                  </div>
                </div>
              );
            })()}

            {buildMonthlyData().length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.textMuted, fontSize: 14 }}>No data yet.</div>}
            {buildMonthlyData().map(([mk, data]) => {
              const p = data.income - data.expenses; const [yr, mo] = mk.split("-");
              const mn = new Date(+yr, +mo - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
              const mg = data.income > 0 ? ((p / data.income) * 100).toFixed(1) : "0.0";
              return (
                <div key={mk} style={{ background: C.card, borderRadius: 14, padding: 18, marginBottom: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, fontFamily: fd, color: C.text }}>{mn}</div>
                    <div style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: p >= 0 ? C.greenDim : C.redDim, color: p >= 0 ? C.green : C.red }}>{mg}% margin</div>
                  </div>
                  <div style={{ background: C.bg, borderRadius: 10, padding: 14, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>Profit & Loss Statement</div>
                    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Revenue</div>
                    {Object.entries(data.incomeByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "3px 8px", fontSize: 13 }}><span style={{ color: C.textMuted }}>{cat}</span><span style={{ color: C.text, fontWeight: 500 }}>{formatCurrency(amt)}</span></div>)}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: 14, fontWeight: 700, borderTop: `1px solid ${C.border}`, marginTop: 4 }}><span style={{ color: C.text }}>Total Revenue</span><span style={{ color: C.green }}>{formatCurrency(data.income)}</span></div>
                    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6, marginTop: 14 }}>Expenses</div>
                    {Object.entries(data.expenseByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "3px 8px", fontSize: 13 }}><span style={{ color: C.textMuted }}>{cat}</span><span style={{ color: C.text, fontWeight: 500 }}>{formatCurrency(amt)}</span></div>)}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: 14, fontWeight: 700, borderTop: `1px solid ${C.border}`, marginTop: 4 }}><span style={{ color: C.text }}>Total Expenses</span><span style={{ color: C.red }}>{formatCurrency(data.expenses)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 8px", fontSize: 16, fontWeight: 700, fontFamily: fd, borderTop: `2px solid ${C.accent}`, marginTop: 10 }}><span style={{ color: C.accent }}>Net Profit</span><span style={{ color: p >= 0 ? C.green : C.red }}>{formatCurrency(p)}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        input, select { outline: none; }
        input:focus, select:focus { border-color: ${C.accent} !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

const lbl = { fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 };
const inp = { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, fontFamily: fb, boxSizing: "border-box" };
const catHdr = { fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 };
const catRow = { display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12 };
