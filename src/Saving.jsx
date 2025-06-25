import React from 'react';

const Saving = () => {
  const [savingPercent, setSavingPercent] = useState(10); 

  return (
    <div className='page-section'>
      <h2>My Saving Plan</h2>
      <label>
        Set Saving Percentage (%):
        <input 
          type="number" 
          value={savingPercent}
          min="0"
          max="100"
          onChange={(e) => setSavingPercent(parseFloat(e.target.value))} 
        />
      </label>
      <p>Saving Plan Today: ₦{(1000 * savingPercent / 100).toFixed(2)}</p>  
    </div>
  );
};


export default Saving;