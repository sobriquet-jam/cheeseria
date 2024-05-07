import React, { useState } from 'react';
import '../css/calculator.css';

interface Cheese {
  name: string;
  pricePerKg: number;
}

interface Props {
  cheeses: Cheese[];
}

export const Calculator: React.FC<Props> = ({ cheeses }) => {
  const [quantity, setQuantity] = useState<number[]>(new Array(cheeses.length).fill(0));

  const handleQuantityChange = (cheeseIndex: number, increment: number) => {
    const newQuantity = [...quantity];
    newQuantity[cheeseIndex] += increment;
    setQuantity(newQuantity);
  };

  const calculatePrice = (pricePerKg: number, quantity: number) => {
    return (pricePerKg * quantity).toFixed(2);
  };

  return (
    <div className="calculator-card">
        <h2>Cheese Calculator</h2>
      {cheeses.map((cheese, index) => (
        <div key={index} className="cheese-container">
          <div className="cheese">
            <div className="cheese-info">
              <h3 className="cheese-name">{cheese.name}</h3>
              <p className="price-per-kg">{cheese.pricePerKg} kg</p>
            </div>
            <div className="price">
              <p className="price-selected">${calculatePrice(cheese.pricePerKg, quantity[index])}</p>
            </div>
          </div>
          <div className="controls">
            <button className="decrement" onClick={() => handleQuantityChange(index, -0.1)}>-</button>
            <p>{quantity[index].toFixed(1)} kg</p>
            <button className="increment" onClick={() => handleQuantityChange(index, 0.1)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
};
