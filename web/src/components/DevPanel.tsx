import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Maximize2, 
  Minimize2, 
  User,
  Mic,
  Search, 
  Eye, 
  EyeOff, 
  Film, 
  Navigation2,
  Heart,
  Car
} from 'lucide-react';
import { MdDirectionsCar } from "react-icons/md";

interface DevPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  hudData: any;
  onDataChange: (data: any) => void;
  hudVisible: boolean;
  cinematicBars: boolean;
  streetsVisible: boolean;
  onHudToggle: () => void;
  onCinematicToggle: () => void;
  onStreetsToggle: () => void;
  visibilitySettings: any;
  onVisibilityChange: (settings: any) => void;
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

const DevPanel: React.FC<DevPanelProps> = ({ 
  isVisible, 
  onToggle, 
  hudData, 
  onDataChange,
  hudVisible,
  cinematicBars,
  streetsVisible,
  onHudToggle,
  onCinematicToggle,
  onStreetsToggle,
  visibilitySettings,
  onVisibilityChange
}) => {
  if (!hudData) {
    return null;
  }

  const [activeTab, setActiveTab] = useState('hud');
  const [isMinimized, setIsMinimized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

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

  const updateVisibility = (path: string, value: boolean) => {
    const keys = path.split('.');
    const newSettings = JSON.parse(JSON.stringify(visibilitySettings));
    let current = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onVisibilityChange(newSettings);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && panelRef.current) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const tabs = [
    { id: 'hud', label: 'HUD', icon: <Eye className="w-4 h-4" /> },
    { id: 'visibility', label: 'Visibility', icon: <Settings className="w-4 h-4" /> },
    { id: 'player', label: 'Player', icon: <User className="w-4 h-4" /> },
    { id: 'vehicle', label: 'Vehicle', icon: <MdDirectionsCar className="w-4 h-4" /> },
    { id: 'voice', label: 'Voice', icon: <Mic className="w-4 h-4" /> }
  ];

  const filteredTabs = tabs.filter(tab => 
    tab.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      ref={panelRef}
      className={`fixed bg-black/95 backdrop-blur-3xl border border-gray-500/30 rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ 
        left: position.x,
        top: position.y,
        width: 700, 
        height: isMinimized ? 'auto' : 600,
        zIndex: 9999 
      }}
    >
      {/* Compact Header with drag handle */}
      <div 
        className="flex items-center justify-between p-3 border-b border-gray-500/30 select-none bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-t-2xl cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Settings className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">Dev Panel</h2>
            <p className="text-gray-400 text-xs">Live HUD Configuration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-gray-700/30 rounded-lg transition-all duration-200"
          >
            {isMinimized ? 
              <Maximize2 className="w-4 h-4 text-gray-400" /> : 
              <Minimize2 className="w-4 h-4 text-gray-400" />
            }
          </button>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-500/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tabs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-500/20 overflow-x-auto">
            {filteredTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-400 bg-blue-500/5'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/20'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 overflow-y-auto" style={{ height: 420 }}>
            {activeTab === 'hud' && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg mb-4">HUD Controls</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={onHudToggle}
                    className={`p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      hudVisible 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    {hudVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    <div className="text-left">
                      <div className="font-medium">HUD Visibility</div>
                      <div className="text-xs opacity-70">{hudVisible ? 'Visible' : 'Hidden'}</div>
                    </div>
                  </button>

                  <button
                    onClick={onCinematicToggle}
                    className={`p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      cinematicBars 
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                        : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
                    }`}
                  >
                    <Film className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Cinematic</div>
                      <div className="text-xs opacity-70">{cinematicBars ? 'Active' : 'Inactive'}</div>
                    </div>
                  </button>

                  <button
                    onClick={onStreetsToggle}
                    className={`p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      streetsVisible 
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                        : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
                    }`}
                  >
                    <Navigation2 className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Street Info</div>
                      <div className="text-xs opacity-70">{streetsVisible ? 'Visible' : 'Auto'}</div>
                    </div>
                  </button>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-600/20">
                  <h4 className="text-white font-medium mb-2">FiveM Commands</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="text-blue-400">/hud</code>
                      <span className="text-gray-400">Toggle HUD visibility</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-blue-400">/blackbars</code>
                      <span className="text-gray-400">Toggle cinematic mode</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-blue-400">/streets</code>
                      <span className="text-gray-400">Toggle street info</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visibility' && (
              <div className="space-y-6">
                <h3 className="text-white font-semibold text-lg mb-4">Element Visibility</h3>
                
                {/* Status HUD Controls */}
                <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-600/20">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-red-400" />
                    Status HUD
                  </h4>
                  <div className="space-y-3">
                    <ToggleControl label="Status HUD" value={visibilitySettings.status.visible} path="status.visible" onUpdate={updateVisibility} />
                    
                    <div className="ml-4 space-y-2 border-l border-gray-600/30 pl-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-300 text-sm mb-2">Health</p>
                          <div className="space-y-1">
                            <ToggleControl label="Visible" value={visibilitySettings.status.health.visible} path="status.health.visible" onUpdate={updateVisibility} />
                            <ToggleControl label="Progress" value={visibilitySettings.status.health.progress} path="status.health.progress" onUpdate={updateVisibility} />
                            <ToggleControl label="Numbers" value={visibilitySettings.status.health.numbers} path="status.health.numbers" onUpdate={updateVisibility} />
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-300 text-sm mb-2">Armor</p>
                          <div className="space-y-1">
                            <ToggleControl label="Visible" value={visibilitySettings.status.armor.visible} path="status.armor.visible" onUpdate={updateVisibility} />
                            <ToggleControl label="Progress" value={visibilitySettings.status.armor.progress} path="status.armor.progress" onUpdate={updateVisibility} />
                            <ToggleControl label="Numbers" value={visibilitySettings.status.armor.numbers} path="status.armor.numbers" onUpdate={updateVisibility} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-300 text-sm mb-2">Hunger</p>
                          <div className="space-y-1">
                            <ToggleControl label="Visible" value={visibilitySettings.status.hunger.visible} path="status.hunger.visible" onUpdate={updateVisibility} />
                            <ToggleControl label="Progress" value={visibilitySettings.status.hunger.progress} path="status.hunger.progress" onUpdate={updateVisibility} />
                            <ToggleControl label="Numbers" value={visibilitySettings.status.hunger.numbers} path="status.hunger.numbers" onUpdate={updateVisibility} />
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-gray-300 text-sm mb-2">Thirst</p>
                          <div className="space-y-1">
                            <ToggleControl label="Visible" value={visibilitySettings.status.thirst.visible} path="status.thirst.visible" onUpdate={updateVisibility} />
                            <ToggleControl label="Progress" value={visibilitySettings.status.thirst.progress} path="status.thirst.progress" onUpdate={updateVisibility} />
                            <ToggleControl label="Numbers" value={visibilitySettings.status.thirst.numbers} path="status.thirst.numbers" onUpdate={updateVisibility} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle HUD Controls */}
                <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-600/20">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-400" />
                    Vehicle HUD
                  </h4>
                  <div className="space-y-3">
                    <ToggleControl label="Vehicle HUD" value={visibilitySettings.vehicle.visible} path="vehicle.visible" onUpdate={updateVisibility} />
                    
                    <div className="ml-4 space-y-2 border-l border-gray-600/30 pl-4">
                      <ToggleControl label="Status Icons" value={visibilitySettings.vehicle.icons} path="vehicle.icons" onUpdate={updateVisibility} />
                      <ToggleControl label="Speed Display" value={visibilitySettings.vehicle.speed} path="vehicle.speed" onUpdate={updateVisibility} />
                      <ToggleControl label="Gear Display" value={visibilitySettings.vehicle.gear} path="vehicle.gear" onUpdate={updateVisibility} />
                      
                      <div>
                        <p className="text-gray-300 text-sm mb-2">Status Bars</p>
                        <div className="space-y-1 ml-4">
                          <ToggleControl label="Visible" value={visibilitySettings.vehicle.statusBars.visible} path="vehicle.statusBars.visible" onUpdate={updateVisibility} />
                          <ToggleControl label="Progress" value={visibilitySettings.vehicle.statusBars.progress} path="vehicle.statusBars.progress" onUpdate={updateVisibility} />
                          <ToggleControl label="Numbers" value={visibilitySettings.vehicle.statusBars.numbers} path="vehicle.statusBars.numbers" onUpdate={updateVisibility} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Voice HUD Controls */}
                <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-600/20">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-green-400" />
                    Voice HUD
                  </h4>
                  <div className="space-y-2">
                    <ToggleControl label="Voice HUD" value={visibilitySettings.voice.visible} path="voice.visible" onUpdate={updateVisibility} />
                    <ToggleControl label="Radio Channel" value={visibilitySettings.voice.radioChannel} path="voice.radioChannel" onUpdate={updateVisibility} />
                    <ToggleControl label="Talking Indicator" value={visibilitySettings.voice.talkingIndicator} path="voice.talkingIndicator" onUpdate={updateVisibility} />
                  </div>
                </div>

                {/* Streets HUD Controls */}
                <div className="bg-gray-800/20 rounded-xl p-4 border border-gray-600/20">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Navigation2 className="w-4 h-4 text-purple-400" />
                    Street Info
                  </h4>
                  <div className="space-y-2">
                    <ToggleControl label="Street Info" value={visibilitySettings.streets.visible} path="streets.visible" onUpdate={updateVisibility} />
                    <ToggleControl label="Time Display" value={visibilitySettings.streets.time} path="streets.time" onUpdate={updateVisibility} />
                    <ToggleControl label="Street Name" value={visibilitySettings.streets.street} path="streets.street" onUpdate={updateVisibility} />
                    <ToggleControl label="Postal Code" value={visibilitySettings.streets.postal} path="streets.postal" onUpdate={updateVisibility} />
                  </div>
                </div>
              </div>
            )}

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
