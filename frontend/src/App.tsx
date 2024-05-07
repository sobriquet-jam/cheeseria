import React from 'react';
import { Header } from './components/Header';
import './App.css';
import { Gallery } from './components/Gallery';
import { Calculator } from './components/Calculator';
import { Message } from './components/Message';

import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const queryClient = new QueryClient()


function App() {
  return (
    <QueryClientProvider client={queryClient}>
       <ReactQueryDevtools initialIsOpen={true} />
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <main className="main-content">
        <div className='left-content'>
          <Message />
          <Gallery />
        </div>
        <div className='right-content'>
          <Calculator />
        </div>
      </main>
    </div>
    </QueryClientProvider>
  );
}

export default App;
