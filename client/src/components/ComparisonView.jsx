// client/src/components/ComparisonView.jsx
import React from 'react';

const ComparisonView = ({ data }) => {
  // --- DEFENSIVE CHECK 1 ---
  // If data is null, not an object, or is an empty object, don't render anything.
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    // You could also return a message like <p>Invalid comparison data received.</p>
    return null;
  }

  const items = Object.keys(data);

  return (
    <div className="comparison-container">
      {items.map(item => {
        // --- DEFENSIVE CHECK 2 ---
        // Ensure the item itself is an object and has 'pros' and 'cons' arrays.
        const pros = Array.isArray(data[item]?.pros) ? data[item].pros : [];
        const cons = Array.isArray(data[item]?.cons) ? data[item].cons : [];

        return (
          <div key={item} className="comparison-item">
            <h3>{item}</h3>
            <div className="pros-cons-list">
              <h4>Pros</h4>
              <ul className="pros-list">
                {pros.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </div>
            <div className="pros-cons-list">
              <h4>Cons</h4>
              <ul className="cons-list">
                {cons.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComparisonView;