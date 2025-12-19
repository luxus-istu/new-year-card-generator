import React from 'react';
import Header from './components/Header';
import SigmaSection from './components/SigmaSection';
import './index.css';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <main className="main">
        <SigmaSection />
      </main>
    </>
  );
};

export default App;