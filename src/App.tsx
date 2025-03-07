import React from 'react';
import { WalletCard } from './components/WalletCard';
import './App.css';
import DarkModeToggle from './components/darkmode'; 
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <DarkModeToggle />
      <WalletCard />
    </div>
  );
}

export default App;
