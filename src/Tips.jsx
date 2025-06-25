
import React, { useState } from 'react';

const Tips = () => {
  const tips = {
    Marketing: ["Use social media", "Offer promotions"],
    Inventory: ["Track items daily", "Avoid overstocking"],
    Customers: ["Collect feedback", "Reward loyal buyers"]
  };
  const [expandedTip, setExpandedTip] = useState(null);

  const tip = [
    {
      id: 1,
      title: 'Keep daily records of sales and expenses.',
      details: 'To keep daily records, start by using a simple logbook or digital tool where you record every sale and expense as it happens. Consistency is key. At the end of the day, review your entries to ensure nothing is missing.'
    },
    {
      id: 2,
      title: 'Set saving goals and stick to them.',
      details: 'Determine a specific percentage of your profit to save daily or weekly. Set this money aside in a separate savings account or wallet and avoid dipping into it unless absolutely necessary.'
    },
    {
      id: 3,
      title: 'Reinvest profit into high-performing products.',
      details: 'Identify which products are selling the most and consider buying more stock or improving their quality. This helps grow your revenue over time.'
    },
    {
      id: 4,
      title: 'Minimize unnecessary spending.',
      details: 'Review your expenses regularly and identify costs that can be reduced or eliminated, such as excessive packaging or non-essential items.'
    }
  ];

  const toggleTip = (id) => {
    setExpandedTip(expandedTip === id ? null : id);
  };

  return (
    <div className="page">
      <h2>Business Tips</h2>
      {Object.entries(tips).map(([topic, details]) => (
        <details key={topic}>
          <summary>{topic}</summary>
          <ul>
            {details.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </details>
      ))}
    

    <div className='page-section'>
      <h2>Tips to Save and Grow Your Business</h2>
      <ul>
        {tip.map((tip) => (
          <li key={tip.id} onClick={() => toggleTip(tip.id)} style={{ cursor: 'pointer', marginBottom: '1em'   }}>
            <strong>{tip.title}</strong>
            {expandedTip === tip.id && <p style={{ marginTop: '0.5em' }}>{tip.details}</p>}
          </li>
        ))}
      </ul>
      </div>
      </div>
  );
};

export default Tips;
