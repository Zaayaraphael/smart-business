import { useState } from 'react';
import { ChevronDown, Lightbulb, Megaphone, PackageCheck, Sparkles, UsersRound } from 'lucide-react';

const categories = [
  {
    title: 'Know your numbers',
    icon: PackageCheck,
    description: 'Small, steady habits make clearer decisions possible.',
    tips: [
      ['Record it while it’s fresh', 'Capture each sale and expense on the day it happens. A two-minute habit helps you trust your numbers at the end of the week.'],
      ['Check profit, not just sales', 'Sales show what came in, but profit accounts for what went out. Review both before making a big spending decision.'],
    ],
  },
  {
    title: 'Bring customers back',
    icon: UsersRound,
    description: 'Build relationships that keep your business memorable.',
    tips: [
      ['Ask one useful question', 'A quick, specific question after a purchase can reveal what customers value and what you can improve.'],
      ['Make returning easy', 'Thank repeat customers and let them know when a product they like is available again. Consistency builds trust.'],
    ],
  },
  {
    title: 'Market with intention',
    icon: Megaphone,
    description: 'Spend your time sharing what makes your offer useful.',
    tips: [
      ['Show the product in action', 'A clear photo or short demonstration can explain the value of your product better than a long caption.'],
      ['Notice what gets a response', 'Try a few types of posts, then focus on the ones that lead to real conversations and sales.'],
    ],
  },
];

const Tips = () => {
  const [expandedTip, setExpandedTip] = useState('Record it while it’s fresh');

  return (
    <div className="subpage">
      <section className="welcome-row">
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" /> SMALL STEPS, REAL MOMENTUM</p>
          <h1>Good ideas for <span>growing steadily.</span></h1>
          <p className="welcome-copy">Practical reminders to help you run your business with more confidence.</p>
        </div>
      </section>
      <section className="tips-grid">
        {categories.map(({ title, icon: Icon, description, tips }, index) => (
          <article className="panel tip-category" key={title}>
            <div className={`tip-category-icon tip-tone-${index}`}><Icon size={20} /></div>
            <h2>{title}</h2>
            <p className="tip-description">{description}</p>
            <div className="tip-accordion">
              {tips.map(([tipTitle, details]) => {
                const isOpen = expandedTip === tipTitle;
                return (
                  <div className={`tip-item${isOpen ? ' tip-open' : ''}`} key={tipTitle}>
                    <button type="button" className="tip-trigger" aria-expanded={isOpen} onClick={() => setExpandedTip(isOpen ? null : tipTitle)}>
                      <span>{tipTitle}</span><ChevronDown size={16} />
                    </button>
                    {isOpen && <p className="tip-details">{details}</p>}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>
      <aside className="tips-note"><span><Lightbulb size={19} /></span><p><strong>One thing at a time.</strong> Pick one idea that fits your business today. You can always come back for another.</p><Sparkles className="tips-note-sparkle" size={18} /></aside>
    </div>
  );
};

export default Tips;
