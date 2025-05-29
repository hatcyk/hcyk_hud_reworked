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
  Zap,
  Skull // Add Skull import for death effect
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
import { 
  IoVolumeHighOutline,
  IoVolumeMediumOutline,
  IoVolumeLowOutline
} from 'react-icons/io5';
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';
import { HiSignal, HiSignalSlash } from 'react-icons/hi2';
import DevPanel from './DevPanel';
import SeatbeltIcon from './SeatbeltIcon';

// Street Info HUD Component - Top Center
const StreetHUD: React.FC<{ 
  time: string;
  street: string;
  postalCode: string;
  isVisible: boolean;
}> = ({ time, street, postalCode, isVisible }) => {
  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-500 ease-in-out ${
      isVisible 
        ? 'opacity-100 translate-y-0 scale-100' 
        : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
    }`}>
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-600/60 rounded-full px-6 py-3 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-white font-medium">{time}</span>
          </div>
          
          <div className="w-px h-5 bg-slate-600"></div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-medium">{street}</span>
          </div>
          
          <div className="w-px h-5 bg-slate-600"></div>
          
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
  // Determine which status icons should be visible
  const showHealth = health < 100;
  const showArmor = armor > 0;
  const showStamina = isUnderwater || stamina < 100;
  const showHunger = hunger < 100;
  const showThirst = thirst < 100;
  
  // Check if any status icons are visible
  const hasStatusIcons = showHealth || showArmor || showStamina || showHunger || showThirst;

  return (
    <div className="fixed bottom-8 left-8 z-20">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-600/60 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center">
          {/* Status Section - only show if there are status icons */}
          {hasStatusIcons && (
            <div className="p-4 relative">
              <div className="flex gap-3">
                {/* Health - only show if < 100 */}
                {showHealth && (
                  <div className="relative group">
                    {/* Number overlay - bottom right corner - extra small */}
                    <div className="absolute bottom-0 right-0 bg-slate-900/90 border border-slate-600/40 rounded px-1 py-0.5 min-w-[18px] flex items-center justify-center z-20 text-xs">
                      <span className={`text-xs font-medium tabular-nums leading-none ${health < 25 ? 'text-red-400' : 'text-white'}`}>
                        {Math.max(health, 0)}
                      </span>
                    </div>
                    <div className={`w-[46px] h-[46px] rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                      health <= 0 ? 'border-red-600 bg-red-600/20 shadow-lg shadow-red-600/30' :
                      health < 25 ? 'border-red-400 bg-red-500/10 shadow-lg shadow-red-500/20' : 'border-red-400/60 bg-red-500/10'
                    }`}>
                      {health <= 0 ? (
                        <Skull className="w-5 h-5 text-red-600 animate-pulse" />
                      ) : (
                        <Heart className={`w-5 h-5 ${health < 25 ? 'text-red-400 animate-pulse' : 'text-red-400'}`} />
                      )}
                    </div>
                    {/* Progress arc - lowest layer */}
                    <svg className="absolute inset-0 w-[46px] h-[46px] transform -rotate-90 pointer-events-none z-0">
                      <circle
                        cx="23"
                        cy="23"
                        r="20"
                        fill="none"
                        stroke={health <= 0 ? "#dc2626" : health < 25 ? "#ef4444" : "#f87171"}
                        strokeWidth="2"
                        strokeDasharray={`${Math.min(Math.max(health, 0), 100) * 1.26} 126`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>
                )}

                {/* Armor - only if > 0 with smooth transition and no space when hidden */}
                {showArmor && (
                  <div className="relative group transition-all duration-500 ease-in-out">
                    {/* Number overlay - bottom right corner - extra small */}
                    <div className="absolute bottom-0 right-0 bg-slate-900/90 border border-slate-600/40 rounded px-1 py-0.5 min-w-[18px] flex items-center justify-center z-20 text-xs">
                      <span className={`text-xs font-medium tabular-nums leading-none ${armor < 25 ? 'text-red-400' : 'text-white'}`}>
                        {armor}
                      </span>
                    </div>
                    <div className={`w-[46px] h-[46px] rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                      armor < 25 ? 'border-red-400 bg-red-500/10' : 'border-blue-400/60 bg-blue-500/10'
                    }`}>
                      <Shield className={`w-5 h-5 ${armor < 25 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
                    </div>
                    <svg className="absolute inset-0 w-[46px] h-[46px] transform -rotate-90 pointer-events-none z-0">
                      <circle
                        cx="23"
                        cy="23"
                        r="20"
                        fill="none"
                        stroke={armor < 25 ? "#ef4444" : "#60a5fa"}
                        strokeWidth="2"
                        strokeDasharray={`${Math.min(armor, 100) * 1.26} 126`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>
                )}

                {/* Stamina or Lung Capacity - show when underwater OR when stamina < 100 */}
                {showStamina && (
                  <div className="relative group">
                    {/* Number overlay - bottom right corner - extra small */}
                    <div className="absolute bottom-0 right-0 bg-slate-900/90 border border-slate-600/40 rounded px-1 py-0.5 min-w-[18px] flex items-center justify-center z-20 text-xs">
                      <span className={`text-xs font-medium tabular-nums leading-none ${(isUnderwater ? lungCapacity : stamina) < 25 ? 'text-red-400' : 'text-white'}`}>
                        {isUnderwater ? lungCapacity : stamina}
                      </span>
                    </div>
                    <div className={`w-[46px] h-[46px] rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                      (isUnderwater ? lungCapacity : stamina) < 25 
                        ? 'border-red-400 bg-red-500/10 animate-pulse' 
                        : isUnderwater 
                          ? 'border-cyan-400/60 bg-cyan-500/10' 
                          : 'border-yellow-400/60 bg-yellow-500/10'
                    }`}>
                      {isUnderwater ? (
                        <Droplets className={`w-5 h-5 ${lungCapacity < 25 ? 'text-red-400' : 'text-cyan-400'}`} />
                      ) : (
                        <Zap className={`w-5 h-5 ${stamina < 25 ? 'text-red-400' : 'text-yellow-400'}`} />
                      )}
                    </div>
                    <svg className="absolute inset-0 w-[46px] h-[46px] transform -rotate-90 pointer-events-none z-0">
                      <circle
                        cx="23"
                        cy="23"
                        r="20"
                        fill="none"
                        stroke={
                          (isUnderwater ? lungCapacity : stamina) < 25 
                            ? "#ef4444" 
                            : isUnderwater 
                              ? "#22d3ee" 
                              : "#fbbf24"
                        }
                        strokeWidth="2"
                        strokeDasharray={`${Math.min(isUnderwater ? lungCapacity : stamina, 100) * 1.26} 126`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>
                )}

                {/* Hunger - only show if < 100 */}
                {showHunger && (
                  <div className="relative group">
                    {/* Number overlay - bottom right corner - extra small */}
                    <div className="absolute bottom-0 right-0 bg-slate-900/90 border border-slate-600/40 rounded px-1 py-0.5 min-w-[18px] flex items-center justify-center z-20 text-xs">
                      <span className={`text-xs font-medium tabular-nums leading-none ${hunger < 25 ? 'text-red-400' : 'text-white'}`}>
                        {hunger}
                      </span>
                    </div>
                    <div className={`w-[46px] h-[46px] rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                      hunger < 25 ? 'border-red-400 bg-red-500/10 animate-pulse' : 'border-orange-400/60 bg-orange-500/10'
                    }`}>
                      <Utensils className={`w-5 h-5 ${hunger < 25 ? 'text-red-400' : 'text-orange-400'}`} />
                    </div>
                    <svg className="absolute inset-0 w-[46px] h-[46px] transform -rotate-90 pointer-events-none z-0">
                      <circle
                        cx="23"
                        cy="23"
                        r="20"
                        fill="none"
                        stroke={hunger < 25 ? "#ef4444" : "#fb923c"}
                        strokeWidth="2"
                        strokeDasharray={`${Math.min(hunger, 100) * 1.26} 126`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>
                )}

                {/* Thirst - only show if < 100 */}
                {showThirst && (
                  <div className="relative group">
                    {/* Number overlay - bottom right corner - extra small */}
                    <div className="absolute bottom-0 right-0 bg-slate-900/90 border border-slate-600/40 rounded px-1 py-0.5 min-w-[18px] flex items-center justify-center z-20 text-xs">
                      <span className={`text-xs font-medium tabular-nums leading-none ${thirst < 25 ? 'text-red-400' : 'text-white'}`}>
                        {thirst}
                      </span>
                    </div>
                    <div className={`w-[46px] h-[46px] rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                      thirst < 25 ? 'border-red-400 bg-red-500/10 animate-pulse' : 'border-cyan-400/60 bg-cyan-500/10'
                    }`}>
                      <Droplets className={`w-5 h-5 ${thirst < 25 ? 'text-red-400' : 'text-cyan-400'}`} />
                    </div>
                    <svg className="absolute inset-0 w-[46px] h-[46px] transform -rotate-90 pointer-events-none z-0">
                      <circle
                        cx="23"
                        cy="23"
                        r="20"
                        fill="none"
                        stroke={thirst < 25 ? "#ef4444" : "#22d3ee"}
                        strokeWidth="2"
                        strokeDasharray={`${Math.min(thirst, 100) * 1.26} 126`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Divider after status section - always show if status section exists */}
          {hasStatusIcons && (
            <div className="w-px bg-slate-500/60 h-16 flex-shrink-0"></div>
          )}

          {/* Voice Section - volume and mic only */}
          <div className="p-4 min-w-[120px] transition-all duration-300">
            <div className="flex items-center justify-center gap-3">
              {/* 1st - Voice range icon - standardized to 46x46 */}
              <div className="w-[46px] h-[46px] rounded-xl bg-slate-700/30 border border-slate-600/30 flex items-center justify-center">
                {voice.range === 1 ? (
                  <IoVolumeLowOutline className="w-5 h-5 text-blue-400" />
                ) : voice.range === 2 ? (
                  <IoVolumeMediumOutline className="w-5 h-5 text-yellow-400" />
                ) : (
                  <IoVolumeHighOutline className="w-5 h-5 text-orange-400" />
                )}
              </div>

              {/* 2nd - Mic Icon - standardized to 46x46 */}
              <div className={`w-[46px] h-[46px] rounded-xl border transition-all duration-300 flex items-center justify-center ${
                voice.talking 
                  ? 'bg-emerald-500/20 border-emerald-400/50 shadow-lg shadow-emerald-500/20 scale-110' 
                  : 'bg-slate-700/50 border-slate-600/30 scale-100'
              }`}>
                <Mic className={`w-5 h-5 transition-colors duration-200 ${voice.talking ? 'text-emerald-400' : 'text-slate-400'}`} />
              </div>
            </div>
          </div>

          {/* Radio Section - only show if radio channel is greater than 0 */}
          {voice.radioChannel > 0 && (
            <>
              {/* Divider before radio section */}
              <div className="w-px bg-slate-500/60 h-16 flex-shrink-0"></div>
              
              <div className="p-4 min-w-[120px] transition-all duration-300">
                <div className="flex items-center justify-center gap-3">
                  {/* Radio icon box - standardized to 46x46 */}
                  <div className="w-[46px] h-[46px] rounded-xl border bg-slate-700/50 border-slate-600/30 flex items-center justify-center">
                    <HiSignal className="w-5 h-5 text-emerald-400" />
                  </div>
                  
                  {/* Radio channel box - standardized to 46x46 */}
                  <div className="w-[46px] h-[46px] rounded-xl border bg-slate-700/50 border-slate-600/30 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm font-mono font-bold">
                      {voice.radioChannel}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const VehicleHUD: React.FC<{ vehicle: any; isVisible: boolean }> = ({ vehicle, isVisible }) => {
  const { speed, fuel, engine, seatbelt, gear, leftIndicator, rightIndicator, locked, rpm, smoothLaunch, cruiseControl } = vehicle;

  return (
    <div className={`fixed bottom-8 right-8 z-20 space-y-2 transition-all duration-500 ease-in-out ${
      isVisible 
        ? 'opacity-100 translate-x-0 scale-100' 
        : 'opacity-0 translate-x-8 scale-95 pointer-events-none'
    }`}>
      {/* Icons row above with consistent HUD theme */}
      <div className="flex justify-center gap-2">
        {/* Left Indicator */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-slate-800/95 backdrop-blur-xl ${
          leftIndicator 
            ? 'border-2 border-yellow-400 text-yellow-400 animate-pulse' 
            : 'border border-slate-600/60 text-slate-400'
        }`}>
          <BsArrowLeftShort className="w-4 h-4" />
        </div>

        {/* Smooth Launch */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-slate-800/95 backdrop-blur-xl ${
          smoothLaunch 
            ? 'border-2 border-emerald-400 text-emerald-400' 
            : 'border border-slate-600/60 text-slate-400'
        }`}>
          <IoMdSpeedometer className="w-4 h-4" />
        </div>

        {/* Vehicle Lock */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-slate-800/95 backdrop-blur-xl ${
          locked 
            ? 'border-2 border-blue-400 text-blue-400' 
            : 'border border-slate-600/60 text-slate-400'
        }`}>
          {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </div>

        {/* Seatbelt */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-slate-800/95 backdrop-blur-xl ${
          seatbelt 
            ? 'border-2 border-emerald-400 text-emerald-400' 
            : 'border-2 border-red-400 text-red-400 animate-pulse'
        }`}>
          <SeatbeltIcon className="w-4 h-4" />
        </div>

        {/* Cruise Control */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-slate-800/95 backdrop-blur-xl ${
          cruiseControl 
            ? 'border-2 border-purple-400 text-purple-400' 
            : 'border border-slate-600/60 text-slate-400'
        }`}>
          <GiSpeedometer className="w-4 h-4" />
        </div>

        {/* Right Indicator */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 bg-slate-800/95 backdrop-blur-xl ${
          rightIndicator 
            ? 'border-2 border-yellow-400 text-yellow-400 animate-pulse' 
            : 'border border-slate-600/60 text-slate-400'
        }`}>
          <BsArrowRightShort className="w-4 h-4" />
        </div>
      </div>

      {/* Main HUD with increased fixed width */}
      <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-600/60 rounded-xl p-4 shadow-xl w-[320px]">
        <div className="flex items-center gap-3">
          {/* Speed - fixed width container with monospace font - now first */}
          <div className="text-center w-16 flex-shrink-0">
            <div className="text-4xl font-light text-white tabular-nums">
              {speed.toString().padStart(3, ' ')}
            </div>
            <div className="text-slate-400 text-xs uppercase">km/h</div>
          </div>

          <div className="w-px h-12 bg-slate-600 flex-shrink-0"></div>

          {/* Gear - fixed width container - now second */}
          <div className="text-center w-12 flex-shrink-0">
            <div className={`text-4xl font-light tabular-nums ${
              gear === -1 ? 'text-red-400' : gear === 0 ? 'text-slate-400' : 'text-white'
            }`}>
              {gear === -1 ? 'R' : gear === 0 ? 'N' : gear}
            </div>
            <div className="text-slate-400 text-xs uppercase">gear</div>
          </div>

          <div className="w-px h-12 bg-slate-600 flex-shrink-0"></div>

          {/* Status bars with proper sizing */}
          <div className="space-y-1.5 flex-1">
            {/* Fuel - constrained layout */}
            <div className="flex items-center gap-2 w-full">
              <MdLocalGasStation className={`w-3 h-3 flex-shrink-0 ${fuel < 20 ? 'text-red-400' : 'text-yellow-400'}`} />
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden min-w-0">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    fuel < 20 ? 'bg-red-500' : 'bg-yellow-400'
                  }`}
                  style={{ width: `${Math.min(fuel, 100)}%` }}
                />
              </div>
              <span className={`text-xs font-medium tabular-nums font-mono w-6 text-right flex-shrink-0 ${fuel < 20 ? 'text-red-400' : 'text-white'}`}>
                {fuel}
              </span>
            </div>

            {/* Engine Health - constrained layout */}
            <div className="flex items-center gap-2 w-full">
              <MdEngineering className={`w-3 h-3 flex-shrink-0 ${engine < 30 ? 'text-red-400' : 'text-emerald-400'}`} />
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden min-w-0">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    engine < 30 ? 'bg-red-500' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(engine, 100) * 1.13}%` }}
                />
              </div>
              <span className={`text-xs font-medium tabular-nums font-mono w-6 text-right flex-shrink-0 ${engine < 30 ? 'text-red-400' : 'text-white'}`}>
                {engine}
              </span>
            </div>

            {/* RPM - constrained layout */}
            <div className="flex items-center gap-2 w-full">
              <MdSpeed className={`w-3 h-3 flex-shrink-0 ${rpm > 85 ? 'text-red-400' : 'text-blue-400'}`} />
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden min-w-0">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    rpm > 85 ? 'bg-red-500' : rpm > 70 ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}
                  style={{ width: `${Math.min(rpm, 100) * 1.13}%` }}
                />
              </div>
              <span className={`text-xs font-medium tabular-nums font-mono w-6 text-right flex-shrink-0 ${rpm > 85 ? 'text-red-400' : 'text-white'}`}>
                {rpm}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Screen Effects Component with improved death effects
const ScreenEffects: React.FC<{
  health: number;
  thirst: number;
  hunger: number;
  stamina: number;
  lungCapacity: number;
  isUnderwater: boolean;
  respawnTimer: number;
  respawnTimerMax: number;
}> = ({ health, thirst, hunger, stamina, lungCapacity, isUnderwater, respawnTimer, respawnTimerMax }) => {
  const isDead = health <= 0;
  const criticalHealth = health > 0 && health < 10;
  const lowHealth = health >= 10 && health < 25;
  const criticalThirst = thirst < 10;
  const lowThirst = thirst >= 10 && thirst < 25;
  const criticalHunger = hunger < 10;
  const lowHunger = hunger >= 10 && hunger < 25;
  const lowStamina = stamina < 15;
  const drowning = isUnderwater && lungCapacity < 25;

  // Calculate opacity based on stat values for smooth transitions
  const healthOpacity = isDead ? 1 : Math.max(0, (25 - health) / 25);
  const thirstOpacity = Math.max(0, (25 - thirst) / 25);
  const hungerOpacity = Math.max(0, (25 - hunger) / 25);
  const staminaOpacity = Math.max(0, (15 - stamina) / 15);

  // Calculate respawn status
  const canRespawn = isDead && respawnTimer <= 0;
  const timeRemaining = Math.max(0, Math.ceil(respawnTimer));
  const timerProgress = respawnTimerMax > 0 ? ((respawnTimerMax - respawnTimer) / respawnTimerMax) * 100 : 100;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Death Effect - Redesigned with cinematic style */}
      {isDead && (
        <>
          {/* Cinematic black bars */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-black z-50 animate-in slide-in-from-top duration-1000" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-black z-50 animate-in slide-in-from-bottom duration-1000" />
          
          {/* Main death overlay with film grain effect */}
          <div className="absolute inset-0 bg-black/95 backdrop-grayscale z-40 animate-in fade-in duration-2000">
            {/* Subtle red vignette */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(139, 0, 0, 0.8) 100%)'
              }}
            />
            
            {/* Film grain texture overlay */}
            <div 
              className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px'
              }}
            />
          </div>
          
          {/* Central death UI */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
            {/* Skull container with glow effect */}
            <div className="relative mb-8 animate-in zoom-in duration-1000 delay-500">
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping scale-150" />
              <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse scale-125" />
              
              {/* Main skull container */}
              <div className="relative bg-gradient-to-br from-slate-900 via-black to-slate-800 border-2 border-red-500/60 rounded-full p-8 shadow-2xl">
                {/* Inner glow */}
                <div className="absolute inset-2 rounded-full bg-red-500/5 blur-xl" />
                
                {/* Skull icon */}
                <Skull className="w-20 h-20 text-red-500 drop-shadow-2xl relative z-10 animate-pulse" />
                
                {/* Floating particles effect */}
                <div className="absolute -top-2 -left-2 w-2 h-2 bg-red-500/60 rounded-full animate-bounce delay-100" />
                <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-red-400/40 rounded-full animate-bounce delay-300" />
                <div className="absolute -bottom-3 -left-1 w-1 h-1 bg-red-600/50 rounded-full animate-bounce delay-500" />
                <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-red-500/30 rounded-full animate-bounce delay-700" />
              </div>
            </div>
            
            {/* Death text with typewriter effect */}
            <div className="text-center animate-in slide-in-from-bottom duration-1000 delay-1000">
              {/* Main death text - Czech */}
              <div className="relative mb-4">
                <h1 
                  className="text-6xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600 drop-shadow-2xl animate-pulse"
                  style={{
                    textShadow: '0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  JSI MRTEV
                </h1>
                
                {/* Underline effect */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[expand_2s_ease-out_1.5s_forwards]" />
              </div>
              
              {/* Respawn timer section */}
              <div className="mt-6 opacity-0 animate-[fadeInUp_1s_ease-out_2s_forwards]">
                {!canRespawn ? (
                  <>
                    {/* Timer countdown */}
                    <p className="text-slate-300 text-xl tracking-wider mb-4">
                      Oživení dostupné
                    </p>
                    
                    {/* Timer display with progress bar */}
                    <div className="bg-black/50 border border-red-500/30 rounded-lg px-8 py-4 backdrop-blur-sm min-w-[300px]">
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <Clock className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 text-2xl font-mono font-bold">
                          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 ease-out"
                          style={{ width: `${timerProgress}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  /* Respawn available */
                  <div className="bg-black/50 border border-green-500/30 rounded-lg px-8 py-4 backdrop-blur-sm animate-pulse">
                    <p className="text-green-400 text-lg font-mono mb-2">
                      Drž E pro oživení
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
                      <span className="text-green-300 text-sm">Respawn dostupný</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Corner decorative elements */}
          <div className="absolute top-24 left-8 w-16 h-16 border-l-2 border-t-2 border-red-500/30 z-50 animate-in slide-in-from-left duration-1000 delay-1000" />
          <div className="absolute top-24 right-8 w-16 h-16 border-r-2 border-t-2 border-red-500/30 z-50 animate-in slide-in-from-right duration-1000 delay-1000" />
          <div className="absolute bottom-24 left-8 w-16 h-16 border-l-2 border-b-2 border-red-500/30 z-50 animate-in slide-in-from-left duration-1000 delay-1200" />
          <div className="absolute bottom-24 right-8 w-16 h-16 border-r-2 border-b-2 border-red-500/30 z-50 animate-in slide-in-from-right duration-1000 delay-1200" />
        </>
      )}

      {/* Only show other effects if not dead */}
      {!isDead && (
        <>
          {/* Low Health - Red vignette with smooth intensity */}
          {(health < 25 && health > 0) && (
            <div 
              className="absolute inset-0 transition-all duration-1000 backdrop-saturate-75"
              style={{
                background: `radial-gradient(ellipse at center, transparent ${30 - ((25 - health) / 25 * 10)}%, rgba(127, 29, 29, ${0.3 + ((25 - health) / 25 * 0.3)}) 100%)`,
                opacity: Math.max(0, (25 - health) / 25)
              }}
            />
          )}

          {/* Low Thirst - Blue blur with smooth intensity */}
          {thirst < 25 && (
            <div 
              className="absolute inset-0 transition-all duration-1000"
              style={{
                backdropFilter: `blur(${(25 - thirst) / 25 * 4}px) brightness(${95 - ((25 - thirst) / 25 * 10)}%)`,
                opacity: Math.max(0, (25 - thirst) / 25)
              }}
            >
              <div 
                className="absolute inset-0 mix-blend-overlay transition-all duration-1000"
                style={{
                  backgroundColor: `rgba(34, 211, 238, ${0.1 + ((25 - thirst) / 25 * 0.15)})`,
                  opacity: Math.max(0, (25 - thirst) / 25)
                }}
              />
            </div>
          )}

          {/* Low Hunger - Orange overlay with smooth intensity */}
          {hunger < 25 && (
            <div 
              className="absolute inset-0 transition-all duration-1000"
              style={{
                backdropFilter: `brightness(${95 - ((25 - hunger) / 25 * 20)}%)`,
                opacity: Math.max(0, (25 - hunger) / 25)
              }}
            >
              <div 
                className="absolute inset-0 mix-blend-multiply transition-all duration-1000"
                style={{
                  backgroundColor: `rgba(251, 146, 60, ${0.15 + ((25 - hunger) / 25 * 0.15)})`,
                  opacity: Math.max(0, (25 - hunger) / 25)
                }}
              />
            </div>
          )}

          {/* Low Stamina - Yellow overlay with smooth intensity */}
          {stamina < 15 && (
            <div 
              className="absolute inset-0 transition-all duration-500"
              style={{ opacity: Math.max(0, (15 - stamina) / 15) }}
            >
              <div 
                className="absolute inset-0 bg-yellow-500/10 mix-blend-overlay transition-all duration-500"
                style={{ opacity: Math.max(0, (15 - stamina) / 15) }}
              />
            </div>
          )}

          {/* Drowning - Intense blue overlay with smooth transition */}
          {drowning && (
            <div 
              className="absolute inset-0 backdrop-blur-md backdrop-brightness-50 transition-all duration-1000"
              style={{ opacity: Math.max(0, (25 - lungCapacity) / 25) }}
            >
              <div className="absolute inset-0 bg-blue-900/50 mix-blend-multiply" />
              <div 
                className="absolute inset-0 opacity-75"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 10%, rgba(29, 78, 216, 0.8) 100%)'
                }}
              />
            </div>
          )}

          {/* Critical Health - Heart beat effect with smooth intensity */}
          {health < 10 && health > 0 && (
            <div 
              className="absolute inset-0 transition-all duration-500"
              style={{ opacity: Math.max(0, (25 - health) / 25) }}
            >
              <div 
                className="absolute inset-0 bg-red-600/20 rounded-full scale-150 animate-ping"
                style={{ 
                  opacity: Math.max(0, (25 - health) / 25),
                  animationDuration: `${Math.max(0.5, 2 - ((25 - health) / 25))}s`
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Add custom keyframes to your CSS (you might need to add this to your global CSS)
const customStyles = `
  @keyframes expand {
    from { width: 0%; }
    to { width: 100%; }
  }
  
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;

const HUD: React.FC = () => {
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Add respawn timer state
  const [respawnTimer, setRespawnTimer] = useState(0);
  const [respawnTimerMax, setRespawnTimerMax] = useState(10); // 10 seconds for dev, can be 600 for production (10 minutes)
  
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

  // Remove street HUD animation state
  const [isVehicleHUDAnimating, setIsVehicleHUDAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // F9 for Dev Panel
      if (e.key === 'F9' || e.code === 'F9') {
        e.preventDefault();
        setShowDevPanel(!showDevPanel);
      }
      // Remove F10 functionality
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showDevPanel]);

  // Monitor vehicle state changes for animation
  useEffect(() => {
    setIsVehicleHUDAnimating(true);
    const timer = setTimeout(() => setIsVehicleHUDAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [hudData?.vehicle?.inVehicle]);

  // Respawn timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (hudData.health <= 0 && respawnTimer > 0) {
      interval = setInterval(() => {
        setRespawnTimer(prev => {
          const newTime = prev - 1;
          return newTime <= 0 ? 0 : newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hudData.health, respawnTimer]);

  // Start respawn timer when player dies
  useEffect(() => {
    if (hudData.health <= 0 && respawnTimer === 0) {
      setRespawnTimer(respawnTimerMax);
    }
  }, [hudData.health, respawnTimerMax]);

  // Reset timer when player is alive
  useEffect(() => {
    if (hudData.health > 0) {
      setRespawnTimer(0);
    }
  }, [hudData.health]);

  // Street HUD always shows when in vehicle
  const shouldShowStreetHUD = hudData?.vehicle?.inVehicle;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Update hudData setter to include respawn timer controls
  const updateHudData = (newData: any) => {
    // Ensure stamina doesn't get reset to default values
    const processedData = {
      ...newData,
      stamina: typeof newData.stamina === 'number' ? newData.stamina : (hudData.stamina ?? 90),
      lungCapacity: typeof newData.lungCapacity === 'number' ? newData.lungCapacity : (hudData.lungCapacity ?? 100)
    };
    
    setHudData(processedData);
    
    // If health changed from >0 to <=0, start respawn timer
    if (processedData.health <= 0 && hudData.health > 0) {
      setRespawnTimer(respawnTimerMax);
    }
    // If health changed from <=0 to >0, reset timer
    if (processedData.health > 0 && hudData.health <= 0) {
      setRespawnTimer(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
    }}>
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Screen Effects Layer - Pass respawn timer */}
      <ScreenEffects
        health={hudData?.health ?? 0}
        thirst={hudData?.thirst ?? 0}
        hunger={hudData?.hunger ?? 0}
        stamina={hudData?.stamina ?? 0}
        lungCapacity={hudData?.lungCapacity ?? 0}
        isUnderwater={hudData?.isUnderwater ?? false}
        respawnTimer={respawnTimer}
        respawnTimerMax={respawnTimerMax}
      />
      
      {/* Street Info HUD - Top Center - Shows when in vehicle */}
      <StreetHUD 
        time={formatTime(currentTime)}
        street={hudData?.street || "Unknown Street"}
        postalCode={hudData?.postalCode || "0000"}
        isVisible={shouldShowStreetHUD}
      />

      {/* Player Status HUD - Bottom Left with fade animation */}
      <div className="transition-all duration-300 ease-in-out">
        <PlayerStatusHUD
          health={hudData?.health || 0}
          armor={hudData?.armor || 0}
          hunger={hudData?.hunger || 0}
          thirst={hudData?.thirst || 0}
          stamina={hudData?.stamina ?? 90}
          lungCapacity={hudData?.lungCapacity ?? 100}
          isUnderwater={hudData?.isUnderwater || false}
          voice={hudData?.voice || { range: 2, talking: false, muted: false, radioChannel: 0 }}
        />
      </div>

      {/* Vehicle HUD - Bottom Right with animation */}
      <VehicleHUD 
        vehicle={hudData.vehicle} 
        isVisible={hudData?.vehicle?.inVehicle || false}
      />

      {/* Developer Panel - Pass additional props */}
      {showDevPanel && (
        <DevPanel
          isVisible={showDevPanel}
          onToggle={() => setShowDevPanel(!showDevPanel)}
          hudData={hudData}
          onDataChange={updateHudData}
          respawnTimer={respawnTimer}
          respawnTimerMax={respawnTimerMax}
          onRespawnTimerChange={setRespawnTimer}
          onRespawnTimerMaxChange={setRespawnTimerMax}
        />
      )}

      {/* Dev hints with fade animation - simplified */}
      {!showDevPanel && (
        <div className="fixed top-6 right-6 space-y-2 transition-all duration-300 ease-in-out opacity-20 hover:opacity-80 scale-100">
          <div className="bg-slate-800/80 border border-slate-600/30 rounded-full px-3 py-1 pointer-events-auto transition-all duration-300">
            <span className="text-slate-400 text-xs font-mono">F9 - Dev Panel</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HUD;