import React, { useState, useEffect } from 'react';
// Lucide icons for basic UI
import { 
  Heart, 
  Shield, 
  Utensils, 
  Droplets,
  Mic,
  MicOff,
  Radio,
  Settings,
  Lock,
  Unlock,
  Clock,
  MapPin,
  Zap // Add Zap import for stamina
} from 'lucide-react';
// React Icons - corrected imports
import { 
  MdLocalGasStation, 
  MdSpeed, 
  MdEngineering,
  MdDirectionsCar,
  MdAirlineSeatReclineNormal // Use this instead of PiSeatbelt
} from 'react-icons/md';
import { GiSpeedometer } from 'react-icons/gi';
import { IoMdSpeedometer } from 'react-icons/io';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import DevPanel from './DevPanel';
import SeatbeltIcon from './SeatbeltIcon';

// Street Info HUD Component - Top Center
const StreetHUD: React.FC<{ 
  time: string;
  street: string;
  postalCode: string;
}> = ({ time, street, postalCode }) => {
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-20">
      <div className="bg-black/70 backdrop-blur-lg border border-gray-600/40 rounded-full px-6 py-3 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium">{time}</span>
          </div>
          
          <div className="w-px h-5 bg-gray-600"></div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-400" />
            <span className="text-white font-medium">{street}</span>
          </div>
          
          <div className="w-px h-5 bg-gray-600"></div>
          
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-bold text-sm">#</span>
            <span className="text-white font-medium font-mono">{postalCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Redesigned Player Status HUD with horizontal layout
const PlayerStatusHUD: React.FC<{ 
  health: number;
  armor: number;
  hunger: number;
  thirst: number;
  stamina: number;
  lungCapacity: number;
  isUnderwater: boolean;
  voice: any;
}> = ({ health, armor, hunger, thirst, stamina, lungCapacity, isUnderwater, voice }) => {
  return (
    <div className="fixed bottom-8 left-8 z-20">
      <div className="bg-black/80 backdrop-blur-lg border border-gray-600/40 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex">
          {/* Status Section */}
          <div className="p-4 relative">
            <div className="flex gap-3">
              {/* Health */}
              <div className="relative group">
                {/* Number overlay - bottom right corner - extra small */}
                <div className="absolute bottom-0 right-0 bg-black/95 border border-gray-600/40 rounded px-1 py-0.5 min-w-[16px] flex items-center justify-center z-20 text-xs">
                  <span className={`text-xs font-medium tabular-nums leading-none ${health < 25 ? 'text-red-400' : 'text-white'}`}>
                    {health}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                  health < 25 ? 'border-red-400 bg-red-500/10 shadow-lg shadow-red-500/20' : 'border-red-300/50 bg-red-500/5'
                }`}>
                  <Heart className={`w-4 h-4 ${health < 25 ? 'text-red-400 animate-pulse' : 'text-red-300'}`} />
                </div>
                {/* Progress arc - lowest layer */}
                <svg className="absolute inset-0 w-10 h-10 transform -rotate-90 pointer-events-none z-0">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke={health < 25 ? "#ef4444" : "#f87171"}
                    strokeWidth="2"
                    strokeDasharray={`${health * 1.13} 113`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>

              {/* Armor - only if > 0 with smooth transition */}
              <div className={`relative group transition-all duration-500 ease-in-out transform ${
                armor > 0 ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 -translate-x-4 pointer-events-none'
              }`}>
                {/* Number overlay - bottom right corner - extra small */}
                <div className="absolute bottom-0 right-0 bg-black/95 border border-gray-600/40 rounded px-1 py-0.5 min-w-[16px] flex items-center justify-center z-20 text-xs">
                  <span className={`text-xs font-medium tabular-nums leading-none ${armor < 25 ? 'text-red-400' : 'text-white'}`}>
                    {armor}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                  armor < 25 ? 'border-red-400 bg-red-500/10' : 'border-blue-300/50 bg-blue-500/5'
                }`}>
                  <Shield className={`w-4 h-4 ${armor < 25 ? 'text-red-400 animate-pulse' : 'text-blue-300'}`} />
                </div>
                <svg className="absolute inset-0 w-10 h-10 transform -rotate-90 pointer-events-none z-0">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke={armor < 25 ? "#ef4444" : "#60a5fa"}
                    strokeWidth="2"
                    strokeDasharray={`${armor * 1.13} 113`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>

              {/* Stamina or Lung Capacity */}
              <div className="relative group">
                {/* Number overlay - bottom right corner - extra small */}
                <div className="absolute bottom-0 right-0 bg-black/95 border border-gray-600/40 rounded px-1 py-0.5 min-w-[16px] flex items-center justify-center z-20 text-xs">
                  <span className={`text-xs font-medium tabular-nums leading-none ${(isUnderwater ? lungCapacity : stamina) < 25 ? 'text-red-400' : 'text-white'}`}>
                    {isUnderwater ? lungCapacity : stamina}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                  (isUnderwater ? lungCapacity : stamina) < 25 
                    ? 'border-red-400 bg-red-500/10 animate-pulse' 
                    : isUnderwater 
                      ? 'border-cyan-300/50 bg-cyan-500/5' 
                      : 'border-yellow-300/50 bg-yellow-500/5'
                }`}>
                  {isUnderwater ? (
                    <Droplets className={`w-4 h-4 ${lungCapacity < 25 ? 'text-red-400' : 'text-cyan-300'}`} />
                  ) : (
                    <Zap className={`w-4 h-4 ${stamina < 25 ? 'text-red-400' : 'text-yellow-300'}`} />
                  )}
                </div>
                <svg className="absolute inset-0 w-10 h-10 transform -rotate-90 pointer-events-none z-0">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke={
                      (isUnderwater ? lungCapacity : stamina) < 25 
                        ? "#ef4444" 
                        : isUnderwater 
                          ? "#22d3ee" 
                          : "#fbbf24"
                    }
                    strokeWidth="2"
                    strokeDasharray={`${(isUnderwater ? lungCapacity : stamina) * 1.13} 113`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>

              {/* Hunger */}
              <div className="relative group">
                {/* Number overlay - bottom right corner - extra small */}
                <div className="absolute bottom-0 right-0 bg-black/95 border border-gray-600/40 rounded px-1 py-0.5 min-w-[16px] flex items-center justify-center z-20 text-xs">
                  <span className={`text-xs font-medium tabular-nums leading-none ${hunger < 25 ? 'text-red-400' : 'text-white'}`}>
                    {hunger}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                  hunger < 25 ? 'border-red-400 bg-red-500/10 animate-pulse' : 'border-orange-300/50 bg-orange-500/5'
                }`}>
                  <Utensils className={`w-4 h-4 ${hunger < 25 ? 'text-red-400' : 'text-orange-300'}`} />
                </div>
                <svg className="absolute inset-0 w-10 h-10 transform -rotate-90 pointer-events-none z-0">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke={hunger < 25 ? "#ef4444" : "#fb923c"}
                    strokeWidth="2"
                    strokeDasharray={`${hunger * 1.13} 113`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>

              {/* Thirst */}
              <div className="relative group">
                {/* Number overlay - bottom right corner - extra small */}
                <div className="absolute bottom-0 right-0 bg-black/95 border border-gray-600/40 rounded px-1 py-0.5 min-w-[16px] flex items-center justify-center z-20 text-xs">
                  <span className={`text-xs font-medium tabular-nums leading-none ${thirst < 25 ? 'text-red-400' : 'text-white'}`}>
                    {thirst}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                  thirst < 25 ? 'border-red-400 bg-red-500/10 animate-pulse' : 'border-cyan-300/50 bg-cyan-500/5'
                }`}>
                  <Droplets className={`w-4 h-4 ${thirst < 25 ? 'text-red-400' : 'text-cyan-300'}`} />
                </div>
                <svg className="absolute inset-0 w-10 h-10 transform -rotate-90 pointer-events-none z-0">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke={thirst < 25 ? "#ef4444" : "#22d3ee"}
                    strokeWidth="2"
                    strokeDasharray={`${thirst * 1.13} 113`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-600/40 my-2"></div>

          {/* Voice Section with conditional display animation */}
          <div className={`p-4 min-w-[140px] transition-all duration-300 ${
            voice.radioChannel ? 'opacity-100' : 'opacity-70'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border transition-all duration-300 ${
                voice.talking 
                  ? 'bg-green-500/20 border-green-400/50 shadow-lg shadow-green-500/20 scale-110' 
                  : 'bg-gray-700/50 border-gray-600/30 scale-100'
              }`}>
                <Mic className={`w-4 h-4 transition-colors duration-200 ${voice.talking ? 'text-green-400' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {voice.range === 1 ? 'Whisper' : voice.range === 2 ? 'Normal' : 'Shout'}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Radio className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-400 text-xs font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                    {voice.radioChannel || 'Off'}
                  </span>
                </div>
              </div>
              
              {voice.talking && (
                <div className="flex gap-0.5 items-end animate-in slide-in-from-right-2 duration-300">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1 bg-green-400 rounded-full animate-pulse transition-all duration-200"
                      style={{ 
                        height: `${8 + (i * 3)}px`,
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VehicleHUD: React.FC<{ vehicle: any }> = ({ vehicle }) => {
  const { speed, fuel, engine, seatbelt, gear, leftIndicator, rightIndicator, locked, rpm, smoothLaunch, cruiseControl } = vehicle;

  return (
    <div className="fixed bottom-8 right-8 z-20 space-y-2">
      {/* Icons row above with consistent HUD theme */}
      <div className="flex justify-center gap-2">
        {/* Left Indicator */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-black/80 backdrop-blur-lg ${
          leftIndicator 
            ? 'border-2 border-yellow-400 text-yellow-400 animate-pulse' 
            : 'border border-gray-600/40 text-gray-500'
        }`}>
          <BsArrowLeftShort className="w-6 h-6" />
        </div>

        {/* Smooth Launch */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-black/80 backdrop-blur-lg ${
          smoothLaunch 
            ? 'border-2 border-green-400 text-green-400' 
            : 'border border-gray-600/40 text-gray-500'
        }`}>
          <IoMdSpeedometer className="w-4 h-4" />
        </div>

        {/* Vehicle Lock */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-black/80 backdrop-blur-lg ${
          locked 
            ? 'border-2 border-blue-400 text-blue-400' 
            : 'border border-gray-600/40 text-gray-500'
        }`}>
          {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </div>

        {/* Seatbelt */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-black/80 backdrop-blur-lg ${
          seatbelt 
            ? 'border-2 border-green-400 text-green-400' 
            : 'border-2 border-red-400 text-red-400 animate-pulse'
        }`}>
          <SeatbeltIcon className="w-4 h-4" />
        </div>

        {/* Cruise Control */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-black/80 backdrop-blur-lg ${
          cruiseControl 
            ? 'border-2 border-purple-400 text-purple-400' 
            : 'border border-gray-600/40 text-gray-500'
        }`}>
          <GiSpeedometer className="w-4 h-4" />
        </div>

        {/* Right Indicator */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-black/80 backdrop-blur-lg ${
          rightIndicator 
            ? 'border-2 border-yellow-400 text-yellow-400 animate-pulse' 
            : 'border border-gray-600/40 text-gray-500'
        }`}>
          <BsArrowRightShort className="w-6 h-6" />
        </div>
      </div>

      {/* Main HUD */}
      <div className="bg-black/80 backdrop-blur-lg border border-gray-600/40 rounded-xl p-4 shadow-xl">
        <div className="flex items-center gap-4">
          {/* Gear - fixed formatting */}
          <div className="text-center w-12">
            <div className={`text-4xl font-light ${
              gear === -1 ? 'text-red-400' : gear === 0 ? 'text-gray-400' : 'text-white'
            }`}>
              {gear === -1 ? 'R' : gear === 0 ? 'N' : gear}
            </div>
            <div className="text-gray-400 text-xs uppercase">gear</div>
          </div>

          <div className="w-px h-12 bg-gray-600"></div>

          {/* Speed - fixed formatting */}
          <div className="text-center w-16">
            <div className="text-4xl font-light text-white tabular-nums">{speed}</div>
            <div className="text-gray-400 text-xs uppercase">km/h</div>
          </div>

          <div className="w-px h-12 bg-gray-600"></div>

          {/* Status bars with better icons */}
          <div className="space-y-1.5">
            {/* Fuel - gas station icon */}
            <div className="flex items-center gap-2">
              <MdLocalGasStation className={`w-3 h-3 ${fuel < 20 ? 'text-red-400' : 'text-yellow-400'}`} />
              <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    fuel < 20 ? 'bg-red-500' : 'bg-yellow-400'
                  }`}
                  style={{ width: `${fuel}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${fuel < 20 ? 'text-red-400' : 'text-white'}`}>
                {fuel}
              </span>
            </div>

            {/* Engine Health - engineering icon */}
            <div className="flex items-center gap-2">
              <MdEngineering className={`w-3 h-3 ${engine < 30 ? 'text-red-400' : 'text-green-400'}`} />
              <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    engine < 30 ? 'bg-red-500' : 'bg-green-400'
                  }`}
                  style={{ width: `${engine}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${engine < 30 ? 'text-red-400' : 'text-white'}`}>
                {engine}
              </span>
            </div>

            {/* RPM - speedometer icon */}
            <div className="flex items-center gap-2">
              <MdSpeed className={`w-3 h-3 ${rpm > 85 ? 'text-red-400' : 'text-blue-400'}`} />
              <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    rpm > 85 ? 'bg-red-500' : rpm > 70 ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}
                  style={{ width: `${rpm}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${rpm > 85 ? 'text-red-400' : 'text-white'}`}>
                {rpm}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HUD: React.FC = () => {
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hudData, setHudData] = useState({
    health: 85,
    armor: 60,
    hunger: 75,
    thirst: 65,
    stamina: 90,
    lungCapacity: 100,
    isUnderwater: false,
    voice: {
      range: 2,
      talking: false,
      muted: false,
      radioChannel: 1
    },
    vehicle: {
      inVehicle: true,
      speed: 45,
      fuel: 78,
      engine: 95,
      seatbelt: true,
      gear: 3,
      rpm: 65,
      locked: false,
      leftIndicator: false,
      rightIndicator: false,
      smoothLaunch: false,
      cruiseControl: false
    },
    street: "Vinewood Blvd",
    postalCode: "1337"
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault();
        setShowDevPanel(!showDevPanel);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showDevPanel]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
    }}>
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Street Info HUD - Top Center */}
      <StreetHUD 
        time={formatTime(currentTime)}
        street={hudData?.street || "Unknown Street"}
        postalCode={hudData?.postalCode || "0000"}
      />

      {/* Player Status HUD - Bottom Left */}
      <PlayerStatusHUD
        health={hudData?.health || 0}
        armor={hudData?.armor || 0}
        hunger={hudData?.hunger || 0}
        thirst={hudData?.thirst || 0}
        stamina={hudData?.stamina || 100}
        lungCapacity={hudData?.lungCapacity || 100}
        isUnderwater={hudData?.isUnderwater || false}
        voice={hudData?.voice || { range: 2, talking: false, muted: false, radioChannel: 0 }}
      />

      {/* Vehicle HUD - Bottom Right */}
      {hudData?.vehicle?.inVehicle && (
        <VehicleHUD vehicle={hudData.vehicle} />
      )}

      {/* Developer Panel */}
      {showDevPanel && (
        <DevPanel
          isVisible={showDevPanel}
          onToggle={() => setShowDevPanel(!showDevPanel)}
          hudData={hudData}
          onDataChange={setHudData}
        />
      )}

      {/* Dev hint */}
      {!showDevPanel && (
        <div className="fixed top-6 right-6 bg-black/40 border border-gray-700/30 rounded-full px-3 py-1 pointer-events-auto opacity-20 hover:opacity-80 transition-all duration-300">
          <span className="text-gray-400 text-xs font-mono">F9</span>
        </div>
      )}
    </div>
  );
};

export default HUD;
