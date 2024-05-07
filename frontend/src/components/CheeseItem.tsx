import React from 'react';

interface CheeseItemProps {
  name: string;
  pricePerKilo: number;
  quantity: number;
  onQuantityChange: (increment: number) => void;
}

export const CheeseItem: React.FC<CheeseItemProps> = ({ name, pricePerKilo, quantity, onQuantityChange }) => {
  const calculatePrice = () => {
    return (pricePerKilo * quantity).toFixed(2);
  };

  return (
    <div className="cheese">
      <div className="cheese-info">
        <h3 className="cheese-name">{name}</h3>
        <p className="price-per-kilo">{pricePerKilo} kg</p>
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
