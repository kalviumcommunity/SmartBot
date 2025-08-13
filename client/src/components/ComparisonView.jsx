// client/src/components/ComparisonView.jsx
import React from 'react';

const ComparisonView = ({ data }) => {
  
  const items = Object.keys(data);

  return (
    <div className="comparison-container">
      {items.map(item => (
        <div key={item} className="comparison-item">
          <h3>{item}</h3>
          <div className="pros-cons-list">
            <h4>Pros</h4>
            <ul className="pros-list">
              {data[item].pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
          </div>
          <div className="pros-cons-list">
            <h4>Cons</h4>
            <ul className="cons-list">
              {data[item].cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComparisonView;