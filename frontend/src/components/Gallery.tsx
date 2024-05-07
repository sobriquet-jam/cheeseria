import React from 'react';
import '../css/gallery.css';


export const Gallery: React.FC<{ cheeses: { name: string, pricePerKg: number, colorBubble: string }[] }> = ({ cheeses }) => {
  return (
    <div className="gallery">
      <div className="grid-container">
        {/* Render the first cheese as a large grid item */}
        <div className="grid-item large">
            <div className="top-section">
                <div className="image">
                    <img src={`/images/${cheeses[0].name}.jpg`} alt={cheeses[0].name} />

            </div>
        </div>
        <div className="bottom-section">
            <div className="info">
              <p className="cheese-name">{cheeses[0].name}</p>
              <p className="price-per-kg">${cheeses[0].pricePerKg.toFixed(2)} / kg</p>
            </div>
          </div>
        </div>
        {/* Render the rest of the cheeses as small grid items */}
        {cheeses.slice(1).map((cheese, index) => (
          <div key={index} className="grid-item small">
            <div className="top-section">
                <div className="image">
                    <img src={`/images/${cheese.name}.jpg`} alt={cheese.name} />

                </div>
            </div>
            <div className="bottom-section">
                <div className="info">
                    <p className="cheese-name">{cheese.name}</p>
                    <p className="price-per-kg">${cheese.pricePerKg.toFixed(2)} / kg</p>
                </div>
                
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
