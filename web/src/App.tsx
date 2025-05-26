import { useEffect, useState } from 'react';
import { useHudStore } from './store/hudStore';
import HealthModule from './components/modules/HealthModule';
import ArmorModule from './components/modules/ArmorModule';
import StaminaModule from './components/modules/StaminaModule';
import HungerModule from './components/modules/HungerModule';
import ThirstModule from './components/modules/ThirstModule';
import StatusIconsModule from './components/modules/StatusIconsModule';
import MinimapModule from './components/modules/MinimapModule';
import SpeedometerModule from './components/modules/SpeedometerModule';
import SettingsPanel from './components/settings/SettingsPanel';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { loadSettings, updatePlayerData } = useHudStore();

  // Mock data for development - in production, this would come from FiveM NUI messages
  useEffect(() => {
    loadSettings();

    // Mock data updates - replace with actual NUI event listeners in production
    const interval = setInterval(() => {
      updatePlayerData({
        health: Math.random() * 100,
        armor: Math.random() * 100,
        stamina: Math.random() * 100,
        hunger: Math.random() * 100,
        thirst: Math.random() * 100,
        speed: Math.random() * 180,
        fuel: Math.random() * 100,
        street: 'Alta Street',
        area: 'Downtown'
      });
    }, 2000);

    // Setup NUI event listener
    window.addEventListener('message', handleNuiMessage);

    // For development - press Escape to toggle settings
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(prev => !prev);
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleNuiMessage);
    };
  }, []);

  const handleNuiMessage = (event: MessageEvent) => {
    const data = event.data;

    if (data.type === 'update_hud') {
      updatePlayerData(data.playerData);
    } else if (data.type === 'toggle_settings') {
      setIsSettingsOpen(data.show);
    }
  };

  return (
    <div className="hud-container">
      {/* Fixed position modules */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-2 w-64">
        <HealthModule />
        <ArmorModule />
        <StaminaModule />
        <HungerModule />
        <ThirstModule />
      </div>

      <StatusIconsModule className="fixed top-6 right-6" />
      <MinimapModule className="fixed bottom-6 right-6" />
      <SpeedometerModule className="fixed bottom-6 left-1/2 -translate-x-1/2" />

      {/* Settings panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
        )}
      </AnimatePresence>

      {/* Dev button to open settings - remove in production */}
      <button
        className="fixed top-4 left-4 bg-primary/80 hover:bg-primary text-white px-3 py-1 rounded-md text-sm font-medium pointer-events-auto"
        onClick={() => setIsSettingsOpen(true)}
      >
        Settings
      </button>
    </div>
  );
}

export default App;
