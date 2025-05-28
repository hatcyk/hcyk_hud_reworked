import React, { useState, useEffect } from 'react';
import {
  Settings, 
  X, 
  Maximize2, 
  Minimize2, 
  User,
  Mic
} from 'lucide-react';
import { MdDirectionsCar } from "react-icons/md";
import { useDraggable } from '../hooks/useDraggable';

interface DevPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  hudData: any;
  onDataChange: (data: any) => void;
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
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-white/90 text-sm font-medium">{label}</label>
        <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-1 min-w-[60px] text-center">
          <span className="text-white font-mono text-sm">{value}{unit}</span>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onUpdate(path, parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #374151 ${((value - min) / (max - min)) * 100}%, #374151 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{min}</span>
          <span>{max}</span>
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
    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-600/20 hover:bg-gray-800/50 transition-colors">
      <label className="text-white/90 text-sm font-medium cursor-pointer" onClick={() => onUpdate(path, !value)}>
        {label}
      </label>
      <button
        onClick={() => onUpdate(path, !value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
          value ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

const DevPanel: React.FC<DevPanelProps> = ({ isVisible, onToggle, hudData, onDataChange }) => {
  // Early return if hudData is not available
  if (!hudData) {
    return null;
  }

  const [activeTab, setActiveTab] = useState('player');
  const [isMinimized, setIsMinimized] = useState(false);
  
  const { position, isDragging, dragRef, dragHandlers } = useDraggable({
    initialPosition: { x: 100, y: 100 },
    bounds: {
      left: 0,
      top: 0,
      right: window.innerWidth - 650,
      bottom: window.innerHeight - 550,
    },
  });

  const updateValue = (path: string, value: any) => {
    if (!hudData) return;
    
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(hudData));
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onDataChange(newData);
  };

  const tabs = [
    { id: 'player', label: 'Player', icon: <User className="w-4 h-4" /> },
    { id: 'vehicle', label: 'Vehicle', icon: <MdDirectionsCar className="w-4 h-4" /> },
    { id: 'voice', label: 'Voice', icon: <Mic className="w-4 h-4" /> }
  ];

  return (
    <div 
      ref={dragRef}
      className={`fixed bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-gray-600/50 rounded-3xl shadow-2xl pointer-events-auto transition-all duration-300 ${
        isDragging ? 'scale-[1.02] shadow-3xl ring-2 ring-blue-500/20' : ''
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ 
        left: position.x, 
        top: position.y, 
        width: 650, 
        height: isMinimized ? 'auto' : 550,
        zIndex: 9999 
      }}
    >
      {/* Enhanced Header */}
      <div 
        className={`flex items-center justify-between p-5 border-b border-gray-600/50 select-none bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-t-3xl ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        {...dragHandlers}
        style={{ userSelect: 'none' }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <Settings className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">HUD Developer Panel</h2>
            <p className="text-gray-400 text-sm">Real-time configuration & testing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:scale-110"
          >
            {isMinimized ? 
              <Maximize2 className="w-5 h-5 text-gray-400" /> : 
              <Minimize2 className="w-5 h-5 text-gray-400" />
            }
          </button>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-red-500/20 rounded-xl transition-all duration-200 hover:scale-110 group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Enhanced Tab Navigation */}
          <div className="flex border-b border-gray-600/50 bg-gray-800/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar" style={{ height: 400 }}>
            {activeTab === 'player' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="border-l-4 border-red-400 pl-4">
                      <h3 className="text-white font-bold text-lg mb-4">Health & Protection</h3>
                    </div>
                    <SliderControl 
                      label="Health" 
                      value={hudData?.health || 0} 
                      min={0} 
                      max={100} 
                      path="health" 
                      unit="%" 
                      onUpdate={updateValue} 
                    />
                    <SliderControl 
                      label="Armor" 
                      value={hudData?.armor || 0} 
                      min={0} 
                      max={100} 
                      path="armor" 
                      unit="%" 
                      onUpdate={updateValue} 
                    />
                    <SliderControl 
                      label="Stamina" 
                      value={hudData?.stamina || 100} 
                      min={0} 
                      max={100} 
                      path="stamina" 
                      unit="%" 
                      onUpdate={updateValue} 
                    />
                    <SliderControl 
                      label="Lung Capacity" 
                      value={hudData?.lungCapacity || 100} 
                      min={0} 
                      max={100} 
                      path="lungCapacity" 
                      unit="%" 
                      onUpdate={updateValue} 
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="border-l-4 border-orange-400 pl-4">
                      <h3 className="text-white font-bold text-lg mb-4">Basic Needs</h3>
                    </div>
                    <SliderControl 
                      label="Hunger" 
                      value={hudData?.hunger || 0} 
                      min={0} 
                      max={100} 
                      path="hunger" 
                      unit="%" 
                      onUpdate={updateValue} 
                    />
                    <SliderControl 
                      label="Thirst" 
                      value={hudData?.thirst || 0} 
                      min={0} 
                      max={100} 
                      path="thirst" 
                      unit="%" 
                      onUpdate={updateValue} 
                    />
                    <ToggleControl 
                      label="Underwater" 
                      value={hudData?.isUnderwater || false} 
                      path="isUnderwater" 
                      onUpdate={updateValue} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vehicle' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg">Vehicle Status</h3>
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
                      unit="%" onUpdate={updateValue} 
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
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-lg">Vehicle Controls</h3>
                    <ToggleControl label="Seatbelt" value={hudData.vehicle.seatbelt} path="vehicle.seatbelt" onUpdate={updateValue} />
                    <ToggleControl label="Vehicle Locked" value={hudData.vehicle.locked} path="vehicle.locked" onUpdate={updateValue} />
                    <ToggleControl label="Left Indicator" value={hudData.vehicle.leftIndicator} path="vehicle.leftIndicator" onUpdate={updateValue} />
                    <ToggleControl label="Right Indicator" value={hudData.vehicle.rightIndicator} path="vehicle.rightIndicator" onUpdate={updateValue} />
                    <ToggleControl label="Smooth Launch" value={hudData.vehicle.smoothLaunch} path="vehicle.smoothLaunch" onUpdate={updateValue} />
                    <ToggleControl label="Cruise Control" value={hudData.vehicle.cruiseControl} path="vehicle.cruiseControl" onUpdate={updateValue} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg">Voice Settings</h3>
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
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">Radio Channel</label>
                    <input
                      type="number"
                      value={hudData?.voice?.radioChannel || 0}
                      onChange={(e) => updateValue('voice.radioChannel', parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      min="0"
                      max="999"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DevPanel;
