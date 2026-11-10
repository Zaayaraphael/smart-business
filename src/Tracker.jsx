import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  Download,
  Plus,
  ReceiptText,
  Sparkles,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const STORAGE_KEY = 'entries';
const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});
const formatMoney = (value) => currency.format(value);

function readEntries() {
  try {
    const storedEntries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(storedEntries)
      ? storedEntries
        .filter((entry) => entry && typeof entry.name === 'string' && Number.isFinite(Number(entry.amount)))
        .map((entry, index) => ({
          ...entry,
          id: entry.id || `saved-${index}-${entry.date || 'entry'}-${entry.name}`,
          type: entry.type === 'expense' ? 'expense' : 'sale',
          date: entry.date || new Date().toISOString().slice(0, 10),
        }))
      : [];
  } catch {
    return [];
  }
}

function StatCard({ title, amount, icon: Icon, tone, helper, change }) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className={`stat-icon ${tone}`}><Icon size={19} /></span>
        <span className={`stat-change ${change === 'down' ? 'negative' : ''}`}>
          {change === 'down' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
          {helper}
        </span>
      </div>
      <p className="stat-label">{title}</p>
      <p className="stat-value">{formatMoney(amount)}</p>
      <p className="stat-helper">From your recorded transactions</p>
    </article>
  );
}

function Tracker() {
  const [entries, setEntries] = useState(readEntries);
  const [item, setItem] = useState({ name: '', amount: '', type: 'sale' });
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const receiptRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const totals = useMemo(() => entries.reduce((result, entry) => {
    const amount = Number(entry.amount) || 0;
    if (entry.type === 'sale') result.sales += amount;
    else result.expenses += amount;
    return result;
  }, { sales: 0, expenses: 0 }), [entries]);

  const profit = totals.sales - totals.expenses;
  const filteredEntries = activeFilter === 'all'
    ? entries
    : entries.filter((entry) => entry.type === activeFilter);

  const chartData = useMemo(() => {
    const dailyTotals = new Map();
    entries.forEach((entry) => {
      const date = entry.date || new Date().toISOString().slice(0, 10);
      const day = new Date(`${date}T00:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric' });
      const current = dailyTotals.get(date) || { date, day, sales: 0, expenses: 0 };
      current[entry.type === 'sale' ? 'sales' : 'expenses'] += Number(entry.amount) || 0;
      dailyTotals.set(date, current);
    });
    return [...dailyTotals.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-7);
  }, [entries]);

  const handleAdd = (event) => {
    event.preventDefault();
    const amount = Number(item.amount);
    if (!item.name.trim() || !Number.isFinite(amount) || amount <= 0) {
      setNotice('Enter a description and an amount greater than zero.');
      return;
    }

    setEntries((current) => [{
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: item.name.trim(),
      amount,
      type: item.type,
      date: new Date().toISOString().slice(0, 10),
    }, ...current]);
    setItem({ name: '', amount: '', type: item.type });
    setNotice('');
  };

  const handleDelete = (id) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  const handleClearEntries = () => {
    if (entries.length && window.confirm('Clear all transactions? This cannot be undone.')) {
      setEntries([]);
      setSummary('');
    }
  };

  const generateAIAdvice = async () => {
    if (!entries.length) {
      setNotice('Add a transaction first to get a useful business insight.');
      return;
    }
    setLoading(true);
    setNotice('');
    setSummary('');
    try {
      const response = await fetch('/.netlify/functions/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Act as a practical small-business coach. In 3 short bullet points, summarize this business's activity, identify one useful pattern, and suggest one actionable next step. Sales: ${formatMoney(totals.sales)}. Expenses: ${formatMoney(totals.expenses)}. Profit: ${formatMoney(profit)}. Records: ${JSON.stringify(entries.slice(0, 30))}`,
          }],
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.result) throw new Error(data.error || 'Could not generate an insight.');
      setSummary(data.result);
    } catch (error) {
      setNotice(error.message || 'Could not generate an insight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = useReactToPrint({ contentRef: receiptRef });

  return (
    <div className="dashboard">
      <section className="welcome-row">
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" /> YOUR BUSINESS, AT A GLANCE</p>
          <h1>Good business starts with <span>good numbers.</span></h1>
          <p className="welcome-copy">Track today’s activity and see how your business is doing.</p>
        </div>
        <div className="date-pill"><CalendarDays size={16} /> {new Date().toLocaleDateString('en', { weekday: 'short', month: 'long', day: 'numeric' })}</div>
      </section>

      <section className="stats-grid" aria-label="Business summary">
        <StatCard title="Total sales" amount={totals.sales} icon={CircleDollarSign} tone="green" helper="Income" />
        <StatCard title="Total expenses" amount={totals.expenses} icon={Wallet} tone="orange" helper="Spending" change="down" />
        <StatCard title="Net profit" amount={profit} icon={TrendingUp} tone="blue" helper={profit >= 0 ? 'Positive' : 'Review'} change={profit < 0 ? 'down' : undefined} />
        <StatCard title="Transactions" amount={entries.length} icon={ReceiptText} tone="purple" helper="This period" />
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">PERFORMANCE</p>
              <h2>Cash flow</h2>
            </div>
            <span className="chart-legend"><i /> Sales <i className="legend-expense" /> Expenses</span>
          </div>
          {chartData.length ? (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 12, right: 4, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9b70" stopOpacity={0.19} />
                      <stop offset="100%" stopColor="#0d9b70" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expensesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f29b55" stopOpacity={0.17} />
                      <stop offset="100%" stopColor="#f29b55" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#edf1ef" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8b9691', fontSize: 11 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b9691', fontSize: 11 }} tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value} />
                  <Tooltip formatter={(value) => formatMoney(value)} contentStyle={{ borderRadius: 12, border: '1px solid #e8eeea', fontSize: 12 }} />
                  <Area type="monotone" dataKey="sales" name="Sales" stroke="#0d9b70" strokeWidth={2.5} fill="url(#salesFill)" />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f29b55" strokeWidth={2.5} fill="url(#expensesFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-empty">
              <span className="empty-chart-icon"><ChartNoAxesCombined size={22} /></span>
              <strong>Your cash flow will appear here</strong>
              <p>Add your first sale or expense to start seeing your business trends.</p>
            </div>
          )}
        </article>

        <article className="panel add-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">QUICK ENTRY</p>
              <h2>Add a transaction</h2>
            </div>
            <span className="add-icon"><Plus size={19} /></span>
          </div>
          <form onSubmit={handleAdd} className="transaction-form">
            <label htmlFor="entry-name">What was it for?</label>
            <input id="entry-name" value={item.name} onChange={(event) => setItem({ ...item, name: event.target.value })} placeholder="e.g. Lunch orders" maxLength={80} required />
            <label htmlFor="entry-amount">Amount</label>
            <div className="amount-input"><span>₦</span><input id="entry-amount" type="number" value={item.amount} onChange={(event) => setItem({ ...item, amount: event.target.value })} placeholder="0.00" min="0.01" step="0.01" required /></div>
            <div className="type-switch" aria-label="Transaction type">
              <button type="button" className={item.type === 'sale' ? 'selected sale-selected' : ''} onClick={() => setItem({ ...item, type: 'sale' })}>Sale / income</button>
              <button type="button" className={item.type === 'expense' ? 'selected expense-selected' : ''} onClick={() => setItem({ ...item, type: 'expense' })}>Expense</button>
            </div>
            <button type="submit" className="primary-button"><Plus size={17} /> Add transaction</button>
          </form>
        </article>
      </section>

      <section className="panel transactions-panel">
        <div className="panel-heading transaction-heading">
          <div>
            <p className="panel-kicker">YOUR ACTIVITY</p>
            <h2>Recent transactions <span className="count-badge">{entries.length}</span></h2>
          </div>
          <div className="transaction-actions">
            <div className="filter-tabs" aria-label="Filter transactions">
              {['all', 'sale', 'expense'].map((filter) => (
                <button key={filter} type="button" className={activeFilter === filter ? 'filter-active' : ''} onClick={() => setActiveFilter(filter)}>
                  {filter === 'all' ? 'All' : filter === 'sale' ? 'Sales' : 'Expenses'}
                </button>
              ))}
            </div>
            <button type="button" className="icon-action" onClick={printReceipt} disabled={!entries.length} aria-label="Print transactions"><Download size={16} /></button>
            <button type="button" className="icon-action danger-action" onClick={handleClearEntries} disabled={!entries.length} aria-label="Clear all transactions"><Trash2 size={16} /></button>
          </div>
        </div>

        {filteredEntries.length ? (
          <div className="transactions-table-wrap">
            <table className="transactions-table">
              <thead><tr><th>TRANSACTION</th><th>DATE</th><th>TYPE</th><th className="amount-col">AMOUNT</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {filteredEntries.slice(0, 10).map((entry, index) => (
                  <motion.tr key={entry.id || `${entry.name}-${entry.date}-${index}`} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    <td><span className={`transaction-avatar ${entry.type}`}>{entry.type === 'sale' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}</span><span className="transaction-name">{entry.name}</span></td>
                    <td className="muted-cell">{entry.date ? new Date(`${entry.date}T00:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}</td>
                    <td><span className={`type-badge ${entry.type}`}>{entry.type === 'sale' ? 'Sale' : 'Expense'}</span></td>
                    <td className={`amount-col amount-value ${entry.type}`}>{entry.type === 'sale' ? '+' : '−'}{formatMoney(Number(entry.amount) || 0)}</td>
                    <td><button type="button" className="row-delete" onClick={() => handleDelete(entry.id)} aria-label={`Delete ${entry.name}`}><Trash2 size={15} /></button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredEntries.length > 10 && <p className="table-footnote">Showing the latest 10 transactions.</p>}
          </div>
        ) : (
          <div className="transactions-empty">
            <span className="empty-transaction-icon"><ReceiptText size={22} /></span>
            <strong>{entries.length ? 'No transactions in this view' : 'Your first entry is a big step'}</strong>
            <p>{entries.length ? 'Try another filter to see your activity.' : 'Add a sale or expense above and your business activity will show up here.'}</p>
          </div>
        )}
      </section>

      <section className="insight-banner">
        <span className="insight-sparkle"><Sparkles size={20} /></span>
        <div className="insight-copy"><strong>A little insight goes a long way</strong><span>Get a practical AI-powered summary of your recent business activity.</span></div>
        <button type="button" className="insight-button" onClick={generateAIAdvice} disabled={loading || !entries.length}>
          <Sparkles size={15} /> {loading ? 'Thinking…' : 'Get business insight'}
        </button>
      </section>
      {summary && <motion.section className="panel ai-summary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div className="ai-summary-title"><Sparkles size={17} /><h2>Your business insight</h2></div><p>{summary}</p></motion.section>}
      {notice && !loading && <p className="notice insight-notice" role="status">{notice}</p>}

      <div className="print-receipt" ref={receiptRef}>
        <h2>SmartBiz transaction report</h2>
        <p>Generated {new Date().toLocaleDateString()}</p>
        <p>Sales: {formatMoney(totals.sales)} · Expenses: {formatMoney(totals.expenses)} · Profit: {formatMoney(profit)}</p>
        <ul>{entries.map((entry, index) => <li key={entry.id || index}>{entry.date || 'Today'} — {entry.type}: {entry.name} — {formatMoney(Number(entry.amount) || 0)}</li>)}</ul>
      </div>
    </div>
  );
}

export default Tracker;
