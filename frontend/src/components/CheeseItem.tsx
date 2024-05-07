import React from 'react';

interface CheeseItemProps {
  name: string;
  pricePerKg: number;
  quantity: number;
  onQuantityChange: (increment: number) => void;
}

export const CheeseItem: React.FC<CheeseItemProps> = ({ name, pricePerKg, quantity, onQuantityChange }) => {
  const calculatePrice = () => {
    return (pricePerKg * quantity).toFixed(2);
  };

  return (
    <div className="cheese">
      <div className="cheese-info">
        <h3 className="cheese-name">{name}</h3>
        <p className="price-per-kg">{pricePerKg} kg</p>
      </div>
      <div className="price">
        <p className="price-selected">${calculatePrice()}</p>
      </div>
      <div className="controls">
        <button className="decrement" onClick={() => onQuantityChange(-0.1)}>-</button>
        <p>{quantity.toFixed(1)} kg</p>
        <button className="increment" onClick={() => onQuantityChange(0.1)}>+</button>
      </div>
      
    </div>
  );
};
