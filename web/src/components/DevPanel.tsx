import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import {
  Settings, 
  X, 
  Maximize2, 
  Minimize2, 
  User,
  Mic,
  Activity,
  Zap,
  Skull,
  Heart,
  Clock
} from 'lucide-react';
import { MdDirectionsCar } from "react-icons/md";

interface DevPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  hudData: any;
  onDataChange: (data: any) => void;
  respawnTimer: number;
  respawnTimerMax: number;
  onRespawnTimerChange: (value: number) => void;
  onRespawnTimerMaxChange: (value: number) => void;
}

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  path: string;
  onUpdate: (path: string, value: number) => void;
}

const SliderControl: React.FC<SliderControlProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  unit = "", 
  path, 
  onUpdate 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="group space-y-2 p-3 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300 hover:bg-slate-700/60 shadow-lg">
      <div className="flex justify-between items-center">
        <label className="text-white/90 text-xs font-semibold">{label}</label>
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur border border-white/20 rounded-md px-2 py-1 min-w-[60px] text-center shadow-lg">
          <span className="text-white font-mono text-xs font-bold">{value}{unit}</span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const newValue = Number(e.target.value);
            onUpdate(path, newValue);
          }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer slider backdrop-blur border border-white/10 shadow-inner"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #475569 ${percentage}%, #475569 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-white/50 mt-1 font-medium">
          <span className="bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">{min}</span>
          <span className="bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">{max}</span>
        </div>
      </div>
    </div>
  );
};

interface ToggleControlProps {
  label: string;
  value: boolean;
  path: string;
  onUpdate: (path: string, value: boolean) => void;
}

const ToggleControl: React.FC<ToggleControlProps> = ({ label, value, path, onUpdate }) => {
  return (
    <div className="group p-3 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300 hover:bg-slate-700/60 shadow-lg">
      <div className="flex items-center justify-between">
        <label className="text-white/90 text-xs font-semibold cursor-pointer group-hover:text-white transition-colors truncate pr-2" onClick={() => onUpdate(path, !value)}>
          {label}
        </label>
        <button
          onClick={() => onUpdate(path, !value)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg flex-shrink-0 ${
            value 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-blue-500/25' 
              : 'bg-gradient-to-r from-slate-600 to-slate-700 shadow-slate-500/25'
          }`}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-all duration-300 shadow-lg ${
              value ? 'translate-x-5 shadow-blue-200/50' : 'translate-x-1 shadow-slate-200/50'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const DevPanel: React.FC<DevPanelProps> = ({ 
  isVisible, 
  onToggle, 
  hudData, 
  onDataChange,
  respawnTimer,
  respawnTimerMax,
  onRespawnTimerChange,
  onRespawnTimerMaxChange
}) => {
  // Early return if hudData is not available
  if (!hudData) {
    return null;
  }

  const [activeTab, setActiveTab] = useState('player');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = React.useRef(null); // Add ref for Draggable

  const updateValue = (path: string, value: any) => {
    if (!hudData) return;
    
    // Ensure value is properly handled for stamina and lung capacity
    const numericValue = typeof value === 'number' ? value : Number(value);
    
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(hudData));
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    // Set the final value, ensuring it's within bounds
    const finalKey = keys[keys.length - 1];
    current[finalKey] = numericValue;
    
    onDataChange(newData);
  };

  const tabs = [
    { id: 'player', label: 'Player', icon: <User className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500' },
    { id: 'vehicle', label: 'Vehicle', icon: <MdDirectionsCar className="w-4 h-4" />, color: 'from-blue-500 to-cyan-500' },
    { id: 'voice', label: 'Voice', icon: <Mic className="w-4 h-4" />, color: 'from-purple-500 to-pink-500' }
  ];

  return (
    <Draggable
      nodeRef={nodeRef} // Add nodeRef to fix findDOMNode warning
      handle=".drag-handle"
      bounds="parent"
      defaultPosition={{ x: 100, y: 100 }}
      disabled={!isVisible}
      grid={[1, 1]}
      enableUserSelectHack={false}
      onStart={() => {
        setIsDragging(true);
        document.body.style.cursor = 'grabbing';
      }}
      onDrag={() => {
        // Ensure smooth dragging with no delays
      }}
      onStop={() => {
        setIsDragging(false);
        document.body.style.cursor = '';
      }}
    >
      <div 
        ref={nodeRef} // Add ref to the main container
        className={`fixed rounded-3xl shadow-2xl pointer-events-auto overflow-hidden z-[9999] ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } ${isDragging ? 'dragging-active' : 'dragging-inactive'}`}
        style={{ 
          width: 700, 
          height: isMinimized ? 'auto' : 600,
          background: 'transparent',
          transition: isDragging 
            ? 'none' 
            : isVisible 
              ? 'opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)' 
              : 'none',
          willChange: isDragging ? 'transform' : 'auto',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        {/* Slate Background Wrapper */}
        <div className="absolute inset-0 bg-slate-800/20 backdrop-blur-xl rounded-3xl border border-slate-600/30" />
        
        {/* Main Content Container */}
        <div className="relative h-full flex flex-col">
          {/* Enhanced Header - Drag Handle */}
          <div 
            className="drag-handle relative flex items-center justify-between p-6 border-b border-white/5 select-none rounded-t-3xl overflow-hidden cursor-move flex-shrink-0"
            style={{ 
              userSelect: 'none',
              background: 'transparent',
              transition: isDragging 
                ? 'none' 
                : 'background-color 0.2s ease-out, transform 0.2s ease-out',
              willChange: 'background-color, transform',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-transparent rounded-t-3xl" />
            
            {/* Header Content */}
            <div className="relative flex items-center gap-5">
              <div className="relative p-4 bg-slate-800/60 rounded-2xl border border-slate-600/50 shadow-lg backdrop-blur">
                <Settings className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  HUD Developer Panel
                </h2>
                <p className="text-white/60 text-sm font-medium flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Real-time configuration & testing
                </p>
              </div>
            </div>
            
            <div className="relative flex items-center gap-3">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-3 bg-slate-800/60 hover:bg-slate-700/95 rounded-2xl transition-all duration-300 hover:scale-110 backdrop-blur border border-slate-600/50 hover:border-slate-500/70 group shadow-lg"
              >
                {isMinimized ? 
                  <Maximize2 className="w-5 h-5 text-white/70 group-hover:text-white" /> : 
                  <Minimize2 className="w-5 h-5 text-white/70 group-hover:text-white" />
                }
              </button>
              <button
                onClick={onToggle}
                className="p-3 bg-slate-800/60 hover:bg-red-500/30 rounded-2xl transition-all duration-300 hover:scale-110 backdrop-blur border border-slate-600/50 hover:border-red-400/50 group shadow-lg"
              >
                <X className="w-5 h-5 text-white/70 group-hover:text-red-400" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Enhanced Tab Navigation */}
              <div className="relative flex bg-transparent overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-transparent" />
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 px-8 py-5 text-sm font-semibold flex-1 ${
                      activeTab === tab.id
                        ? 'text-white border-slate-600/50' 
                        : 'text-white/60 hover:text-white border-slate-600/30 hover:border-slate-500/70'
                    } border shadow-lg`}
                    style={{
                      transition: 'all 0.2s ease-out',
                      willChange: 'background-color, color, border-color',
                      transform: 'translate3d(0, 0, 0)',
                      backgroundColor: activeTab === tab.id ? 'rgba(30, 41, 59, 0.6)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div 
                      className={`p-2 rounded-xl ${activeTab === tab.id ? `bg-gradient-to-r ${tab.color}` : 'bg-white/10'}`}
                      style={{
                        transition: 'all 0.2s ease-out',
                        willChange: 'background',
                        transform: 'translate3d(0, 0, 0)'
                      }}
                    >
                      {tab.icon}
                    </div>
                    {tab.label}
                    {activeTab === tab.id && (
                      <>
                        <div 
                          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.color} rounded-full shadow-lg`}
                          style={{
                            animation: 'slide-in 0.2s ease-out'
                          }}
                        />
                        <Zap className="w-3 h-3 text-white/60 animate-pulse ml-auto" />
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* Enhanced Tab Content */}
              <div 
                className="p-4 overflow-y-auto overflow-x-hidden relative flex-1 min-h-0"
                style={{ 
                  scrollBehavior: 'auto',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(148, 163, 184, 0.5) transparent',
                  transform: 'translate3d(0, 0, 0)',
                  willChange: 'scroll-position',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                  contain: 'layout style paint',
                  isolation: 'isolate'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-transparent pointer-events-none" />
                
                <div className="relative" style={{ transform: 'translate3d(0, 0, 0)' }}>
                  {activeTab === 'player' && (
                    <div className="space-y-6">
                      {/* Health & Basic Needs Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-4 min-w-0">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-full shadow-lg shadow-red-500/25" />
                            <h3 className="text-white font-bold text-base bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent truncate">
                              Health & Protection
                            </h3>
                          </div>
                          <div className="space-y-3">
                            <SliderControl label="Health" value={hudData?.health || 0} min={0} max={100} path="health" unit="%" onUpdate={updateValue} />
                            <SliderControl label="Armor" value={hudData?.armor || 0} min={0} max={100} path="armor" unit="%" onUpdate={updateValue} />
                            <SliderControl 
                              label="Stamina" 
                              value={hudData?.stamina ?? 100} 
                              min={0} 
                              max={100} 
                              path="stamina" 
                              unit="%" 
                              onUpdate={updateValue} 
                            />
                            <SliderControl 
                              label="Lung Capacity" 
                              value={hudData?.lungCapacity ?? 100} 
                              min={0} 
                              max={100} 
                              path="lungCapacity" 
                              unit="%" 
                              onUpdate={updateValue} 
                            />
                          </div>
                        </div>
                        <div className="space-y-4 min-w-0">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-lg shadow-orange-500/25" />
                            <h3 className="text-white font-bold text-base bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent truncate">
                              Basic Needs
                            </h3>
                          </div>
                          <div className="space-y-3">
                            <SliderControl label="Hunger" value={hudData?.hunger || 0} min={0} max={100} path="hunger" unit="%" onUpdate={updateValue} />
                            <SliderControl label="Thirst" value={hudData?.thirst || 0} min={0} max={100} path="thirst" unit="%" onUpdate={updateValue} />
                            <ToggleControl label="Underwater" value={hudData?.isUnderwater || false} path="isUnderwater" onUpdate={updateValue} />
                          </div>
                        </div>
                      </div>

                      {/* Death & Respawn Section - Fixed JSX structure */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-6 bg-gradient-to-b from-red-600 to-black rounded-full shadow-lg shadow-red-600/25" />
                          <h3 className="text-white font-bold text-base bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent flex items-center gap-2">
                            <Skull className="w-4 h-4 text-red-400" />
                            Death & Respawn
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Current Respawn Timer */}
                          <div className="space-y-3">
                            <div className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 space-y-2 shadow-lg">
                              <label className="text-white/90 text-xs font-semibold">Current Timer (seconds)</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max={respawnTimerMax}
                                  value={respawnTimer}
                                  onChange={(e) => onRespawnTimerChange(Number(e.target.value))}
                                  className="flex-1 p-2 bg-slate-700/80 backdrop-blur border border-slate-500/60 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all duration-300"
                                />
                                <button
                                  onClick={() => onRespawnTimerChange(0)}
                                  className="px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors font-medium"
                                  title="Reset Timer"
                                >
                                  Reset
                                </button>
                              </div>
                            </div>

                            {/* Max Respawn Timer */}
                            <div className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 space-y-2 shadow-lg">
                              <label className="text-white/90 text-xs font-semibold">Max Timer (seconds)</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="3600"
                                  value={respawnTimerMax}
                                  onChange={(e) => onRespawnTimerMaxChange(Number(e.target.value))}
                                  className="flex-1 p-2 bg-slate-700/80 backdrop-blur border border-slate-500/60 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                                />
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => onRespawnTimerMaxChange(10)}
                                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors font-medium"
                                    title="10 seconds (Dev)"
                                  >
                                    10s
                                  </button>
                                  <button
                                    onClick={() => onRespawnTimerMaxChange(600)}
                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors font-medium"
                                    title="10 minutes (Prod)"
                                  >
                                    10m
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Respawn Status */}
                          <div className="space-y-3">
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-white/90 text-sm font-semibold">Respawn Status:</span>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                  hudData.health <= 0 
                                    ? respawnTimer <= 0 
                                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                                    : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                                }`}>
                                {hudData.health <= 0 
                                  ? respawnTimer <= 0 
                                    ? 'Can Respawn' 
                                    : `Waiting ${Math.ceil(respawnTimer)}s`
                                  : 'Alive'
                                }
                              </div>
                            </div>
                            
                            {/* Progress bar for respawn timer */}
                            {hudData.health <= 0 && respawnTimer > 0 && (
                              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden mb-3">
                                <div 
                                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000"
                                  style={{ 
                                    width: `${((respawnTimerMax - respawnTimer) / respawnTimerMax) * 100}%` 
                                  }}
                                />
                              </div>
                            )}

                            {/* Timer Display */}
                            {hudData.health <= 0 && (
                              <div className="flex items-center justify-center gap-2 text-red-400">
                                <Clock className="w-4 h-4" />
                                <span className="font-mono text-lg font-bold">
                                  {Math.floor(respawnTimer / 60)}:{(respawnTimer % 60).toString().padStart(2, '0')}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => onDataChange({ ...hudData, health: 0 })}
                              className="flex-1 px-3 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1 font-medium"
                            >
                              <Skull className="w-3 h-3" />
                              Kill Player
                            </button>
                            <button
                              onClick={() => {
                                onDataChange({ ...hudData, health: 100 });
                                onRespawnTimerChange(0);
                              }}
                              className="flex-1 px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1 font-medium"
                            >
                              <Heart className="w-3 h-3" />
                              Revive Player
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  )}

                  {activeTab === 'vehicle' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-4 min-w-0">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/25" />
                            <h3 className="text-white font-bold text-base bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent truncate">
                              Vehicle Status
                            </h3>
                          </div>
                          <div className="space-y-3">
                            <ToggleControl 
                              label="In Vehicle" 
                              value={hudData?.vehicle?.inVehicle || false} 
                              path="vehicle.inVehicle" 
                              onUpdate={updateValue} 
                            />
                            <SliderControl 
                              label="Speed" 
                              value={hudData?.vehicle?.speed || 0} 
                              min={0} 
                              max={300} 
                              path="vehicle.speed" 
                              unit=" km/h" 
                              onUpdate={updateValue} 
                            />
                            <SliderControl 
                              label="Fuel" 
                              value={hudData?.vehicle?.fuel || 0} 
                              min={0} 
                              max={100} 
                              path="vehicle.fuel" 
                              unit="%" 
                              onUpdate={updateValue} 
                            />
                            <SliderControl 
                              label="Engine" 
                              value={hudData?.vehicle?.engine || 0} 
                              min={0} 
                              max={100} 
                              path="vehicle.engine" 
                              unit="%" 
                              onUpdate={updateValue} 
                            />
                            <SliderControl 
                              label="RPM" 
                              value={hudData?.vehicle?.rpm || 0} 
                              min={0} 
                              max={100} 
                              path="vehicle.rpm" 
                              unit="%" 
                              onUpdate={updateValue} 
                            />
                            <SliderControl 
                              label="Gear"
                              value={hudData?.vehicle?.gear || 0}
                              min={-1}
                              max={8}
                              path="vehicle.gear"
                              onUpdate={updateValue}
                            />
                          </div>
                        </div>
                        <div className="space-y-4 min-w-0">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-500/25" />
                            <h3 className="text-white font-bold text-base bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent truncate">
                              Vehicle Controls
                            </h3>
                          </div>
                          <div className="space-y-3">
                            <ToggleControl label="Seatbelt" value={hudData?.vehicle?.seatbelt || false} path="vehicle.seatbelt" onUpdate={updateValue} />
                            <ToggleControl label="Vehicle Locked" value={hudData?.vehicle?.locked || false} path="vehicle.locked" onUpdate={updateValue} />
                            <ToggleControl label="Left Indicator" value={hudData?.vehicle?.leftIndicator || false} path="vehicle.leftIndicator" onUpdate={updateValue} />
                            <ToggleControl label="Right Indicator" value={hudData?.vehicle?.rightIndicator || false} path="vehicle.rightIndicator" onUpdate={updateValue} />
                            <ToggleControl label="Smooth Launch" value={hudData?.vehicle?.smoothLaunch || false} path="vehicle.smoothLaunch" onUpdate={updateValue} />
                            <ToggleControl label="Cruise Control" value={hudData?.vehicle?.cruiseControl || false} path="vehicle.cruiseControl" onUpdate={updateValue} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'voice' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full shadow-lg shadow-purple-500/25" />
                        <h3 className="text-white font-bold text-base bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                          Voice Settings
                        </h3>
                      </div>
                      <div className="space-y-3 max-w-md">
                        <SliderControl 
                          label="Voice Range" 
                          value={hudData?.voice?.range || 2} 
                          min={1} 
                          max={3} 
                          path="voice.range" 
                          onUpdate={updateValue} 
                        />
                        <ToggleControl 
                          label="Talking" 
                          value={hudData?.voice?.talking || false} 
                          path="voice.talking" 
                          onUpdate={updateValue} 
                        />
                        <div className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-600/50 space-y-2 shadow-lg">
                          <label className="text-white/90 text-xs font-semibold">Radio Channel</label>
                          <input
                            type="number"
                            value={hudData?.voice?.radioChannel || 0}
                            onChange={(e) => updateValue('voice.radioChannel', parseInt(e.target.value) || 0)}
                            className="w-full p-2 bg-slate-700/80 backdrop-blur border border-slate-500/60 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                            min="0"
                            max="999"
                            placeholder="Enter channel..."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Optimized CSS for ultra-smooth performance - Remove jsx prop */}
        <style>{`
          @keyframes slide-in {
            from {
              transform: scaleX(0);
              opacity: 0;
            }
            to {
              transform: scaleX(1);
              opacity: 1;
            }
          }
          
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.3);
            border-radius: 3px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.5);
            border-radius: 3px;
            transition: background-color 0.1s ease;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.7);
          }
          
          button, input, div[class*="group"] {
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
          }
          
          button:hover {
            transform: translate3d(0, 0, 0) scale(1.02);
          }
          
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    </Draggable>
  );
};

export default DevPanel;
