import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cheese } from '../types';
import '../css/gallery.css';

export const Gallery: React.FC = () => {
  const { data: cheeses, isLoading, isError } = useQuery<Cheese[]>({
    queryKey: ['cheeses'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/cheeses', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cheeses');
      }
      return response.json() as Promise<Cheese[]>;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !cheeses) {
    return <div>Error fetching cheeses</div>;
  }

  return (
    <div className="gallery">
      <div className="grid-container">
        {/* Render the first cheese as a large grid item */}
        <div className="grid-item large">
          <div className="top-section">
            <div className="image">
              <img src={`/images/${cheeses[0].name.toLowerCase()}.jpg`} alt={cheeses[0].name} />
              <div className="overlay">
                <div className="overlay-content">
                  <p>{cheeses[0].description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-section">
            <div className="info">
              <p className="cheese-name">{cheeses[0].name}</p>
              {/* Convert from cents to dollars */}
              <p className="price-per-kilo">${(cheeses[0].pricePerKilo / 100).toFixed(2)} / kg</p>
            </div>
          </div>
        </div>
        {/* Render the rest of the cheeses as small grid items */}
        {cheeses.slice(1).map((cheese, index) => (
          <div key={index} className="grid-item small">
            <div className="top-section">
              <div className="image">
                <img src={`/images/${cheese.name.toLowerCase()}.jpg`} alt={cheese.name} />
                <div className="overlay">
                  <div className="overlay-content">
                    <p>{cheese.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-section">
              <div className="info">
                <p className="cheese-name">{cheese.name}</p>
                {/* Convert from cents to dollars */}
                <p className="price-per-kilo">${(cheese.pricePerKilo / 100).toFixed(2)} / kg</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
