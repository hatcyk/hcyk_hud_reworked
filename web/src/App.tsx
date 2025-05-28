import React, { useState } from 'react';
import HUD from './components/HUD';
import DevPanel from './components/DevPanel';
import './index.css';

function App() {
  // Check if we're in development mode (browser environment)
  const isDev = import.meta.env.DEV && typeof window !== 'undefined';
  
  const [devData, setDevData] = useState({
    health: 85,
    armor: 60,
    stamina: 90,
    hunger: 75,
    thirst: 65,
    cash: 2500,
    bank: 15000,
    crypto: 850,
    job: 'Police Officer',
    grade: 'Senior Officer',
    salary: 75,
    onDuty: true,
    serverId: 42,
    street: 'Vinewood Blvd',
    area: 'Vinewood',
    time: '14:25',
    ping: 45,
    heading: 180,
    voice: {
      range: 2,
      talking: false,
      muted: false,
      radioChannel: 1,
      phoneCall: false
    },
    vehicle: {
      inVehicle: true,
      speed: 45,
      fuel: 78,
      engine: 95,
      seatbelt: true,
      gear: 3,
      rpm: 65
    },
    server: {
      players: 127,
      maxPlayers: 200
    },
    notifications: [
      { id: '1', type: 'success' as const, message: 'Job duty started' },
      { id: '2', type: 'info' as const, message: 'Radio frequency: 101.1' }
    ]
  });

  return (
    <div className="App w-screen h-screen bg-transparent">
      <HUD playerData={isDev ? devData : undefined} devMode={isDev} />
      {isDev && (
        <DevPanel 
          currentData={devData} 
          onDataChange={setDevData}
        />
      )}
    </div>
  );
}

export default App;
