import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import '../css/calculator.css';

interface Cheese {
  name: string;
  pricePerKilo: number;
}

export const Calculator: React.FC = () => {
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

  const [quantity, setQuantity] = useState<number[]>(new Array(cheeses?.length || 0).fill(0));

  const handleQuantityChange = (cheeseIndex: number, increment: number) => {
    const newQuantity = [...quantity];
    newQuantity[cheeseIndex] += increment;
    setQuantity(newQuantity);
  };

  const calculatePrice = (pricePerKilo: number, quantity: number) => {
    return ((pricePerKilo / 100) * quantity).toFixed(2);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (isError || !cheeses) {
    return <div>Error fetching cheeses</div>;
  }
  
  return (
    <div className="calculator-card">
      <h2>Cheese Calculator</h2>
      {cheeses.map((cheese, index) => (
        <div key={index} className="cheese-container">
          <div className="cheese">
            <div className="cheese-info">
              <h3 className="cheese-name">{cheese.name}</h3>
              <p className="price-per-kilo">${cheese.pricePerKilo / 100} P/K</p>
            </div>
            <div className="price">
              <p className="price-selected">${calculatePrice(cheese.pricePerKilo, quantity[index])}</p>
            </div>
          </div>
          <div className="controls">
            <button className="decrement" onClick={() => handleQuantityChange(index, -0.1)}>-</button>
            <p>{quantity[index].toFixed(1)} kgs</p>
            <button className="increment" onClick={() => handleQuantityChange(index, 0.1)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
};  