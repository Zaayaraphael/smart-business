import { useMemo, useState } from 'react';
import { ArrowDownToLine, PiggyBank, Sparkles, Target } from 'lucide-react';

const Saving = () => {
  const [savingPercent, setSavingPercent] = useState(10);
  const [entries] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('entries') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const profit = useMemo(() => entries.reduce((total, entry) => {
    const amount = Number(entry.amount) || 0;
    return total + (entry.type === 'sale' ? amount : -amount);
  }, 0), [entries]);
  const targetPercent = Number(savingPercent) || 0;
  const suggestedSavings = Math.max(0, profit) * targetPercent / 100;

  return (
    <div className="subpage">
      <section className="welcome-row">
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" /> BUILD A BUSINESS BUFFER</p>
          <h1>Make room for <span>what’s next.</span></h1>
          <p className="welcome-copy">Turn a small, consistent part of your profit into a growth fund.</p>
        </div>
      </section>
      <section className="savings-layout">
        <article className="panel savings-panel">
          <span className="large-feature-icon"><PiggyBank size={24} /></span>
          <p className="panel-kicker">YOUR SAVINGS PLAN</p>
          <h2>Choose a percentage to set aside</h2>
          <p className="savings-description">Your suggestion is based on the profit from transactions in your tracker.</p>
          <label className="savings-label" htmlFor="savings-percent">Savings percentage <strong>{targetPercent}%</strong></label>
          <input id="savings-percent" className="range-input" type="range" min="0" max="50" step="1" value={targetPercent} onChange={(event) => setSavingPercent(event.target.value)} />
          <div className="range-labels"><span>0%</span><span>25%</span><span>50%</span></div>
          <div className="savings-result">
            <div><span className="savings-result-label"><ArrowDownToLine size={15} /> SUGGESTED TO SAVE</span><strong>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(suggestedSavings)}</strong></div>
            <span className="savings-result-note">at {targetPercent}% of your profit</span>
          </div>
        </article>
        <aside className="savings-side">
          <article className="panel savings-side-card">
            <span className="side-card-icon"><Target size={19} /></span>
            <p className="panel-kicker">A GOOD START</p>
            <h3>Consistency beats perfection.</h3>
            <p>Begin with an amount that feels manageable. Review your savings percentage as your business grows.</p>
          </article>
          <article className="savings-tip">
            <Sparkles size={17} />
            <p><strong>One helpful habit</strong><br />Keep business savings separate from day-to-day spending so your growth fund stays visible.</p>
          </article>
        </aside>
      </section>
    </div>
  );
};

export default Saving;
