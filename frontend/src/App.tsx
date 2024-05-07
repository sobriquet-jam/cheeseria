import React from 'react';
import { Header } from './components/Header';
import './App.css';
import { Gallery } from './components/Gallery';
import { Calculator } from './components/Calculator';
import { Message } from './components/Message';

const cheeses = [
  { name: 'Brie', pricePerKg: 12.99, colorBubble: '#FFFACD' }, // Lemon Chiffon
  { name: 'Cheddar', pricePerKg: 8.99, colorBubble: '#FAFAD2' }, // Light Goldenrod Yellow
  { name: 'Gouda', pricePerKg: 10.49, colorBubble: '#FFFFE0' }, // Light Yellow
  { name: 'Blue', pricePerKg: 15.99, colorBubble: '#FFDAB9' }, // Peachpuff
  { name: 'Feta', pricePerKg: 9.49, colorBubble: '#F0FFF0' }, // Honeydew
];


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <main className="main-content">
        <div className='left-content'>
          <Message />
          <Gallery cheeses={cheeses} />
        </div>
        <div className='right-content'>
          <Calculator cheeses={cheeses} />
        </div>
      </main>
    </div>
  );
}

export default App;
