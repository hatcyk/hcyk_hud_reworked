import { motion } from 'framer-motion';
import { useState } from 'react';
import { useHudStore } from '../../store/hudStore';
import { X, Save, RotateCcw, Eye, EyeOff, Move } from 'lucide-react';
import { sendNuiMessage } from '../../lib/utils';

type SettingsPanelProps = {
  onClose: () => void;
}

type TabType = 'modules' | 'appearance' | 'position';

function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { modules, theme, updateModuleSettings, updateTheme, resetSettings } = useHudStore();
  const [activeTab, setActiveTab] = useState<TabType>('modules');
  const [dragMode, setDragMode] = useState(false);

  const handleSave = () => {
    // In a real implementation, this would save the settings to the server
    sendNuiMessage('saveSettings', { modules, theme });
    onClose();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      resetSettings();
    }
  };

  const toggleModule = (moduleName: keyof typeof modules, enabled: boolean) => {
    updateModuleSettings(moduleName, { enabled });
  };

  const updateOpacity = (moduleName: keyof typeof modules, opacity: number) => {
    updateModuleSettings(moduleName, { opacity });
  };

  const updateScale = (moduleName: keyof typeof modules, scale: number) => {
    updateModuleSettings(moduleName, { scale });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">HUD Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-white/10">
          <button
            className={`px-4 py-2 flex-1 transition-colors ${activeTab === 'modules' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
            onClick={() => setActiveTab('modules')}
          >
            Modules
          </button>
          <button
            className={`px-4 py-2 flex-1 transition-colors ${activeTab === 'appearance' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button
            className={`px-4 py-2 flex-1 transition-colors ${activeTab === 'position' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
            onClick={() => setActiveTab('position')}
          >
            Position
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'modules' && (
            <div className="space-y-4">
              {Object.entries(modules).map(([key, module]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="font-medium capitalize">{key}</div>
                  <button
                    onClick={() => toggleModule(key as keyof typeof modules, !module.enabled)}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    {module.enabled ? (
                      <Eye className="w-5 h-5 text-primary" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-white/50" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Theme</h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-4 rounded-lg border ${theme.darkMode ? 'border-primary bg-primary/20' : 'border-white/10'}`}
                    onClick={() => updateTheme({ darkMode: true })}
                  >
                    Dark Mode
                  </button>

                  <button
                    className={`p-4 rounded-lg border ${!theme.darkMode ? 'border-primary bg-primary/20' : 'border-white/10'}`}
                    onClick={() => updateTheme({ darkMode: false })}
                  >
                    Light Mode
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="glassEffect"
                    checked={theme.glassEffect}
                    onChange={(e) => updateTheme({ glassEffect: e.target.checked })}
                  />
                  <label htmlFor="glassEffect">Glass Effect</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="roundedCorners"
                    checked={theme.roundedCorners}
                    onChange={(e) => updateTheme({ roundedCorners: e.target.checked })}
                  />
                  <label htmlFor="roundedCorners">Rounded Corners</label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Module Appearance</h3>

                {Object.entries(modules).map(([key, module]) => (
                  <div key={key} className="space-y-2">
                    <div className="font-medium capitalize">{key}</div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm opacity-70">Opacity</label>
                          <span className="text-sm">{Math.round(module.opacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.05"
                          value={module.opacity}
                          onChange={(e) => updateOpacity(key as keyof typeof modules, parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm opacity-70">Scale</label>
                          <span className="text-sm">{module.scale.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="1.5"
                          step="0.1"
                          value={module.scale}
                          onChange={(e) => updateScale(key as keyof typeof modules, parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'position' && (
            <div className="space-y-4">
              <div className="bg-primary/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Move className="w-5 h-5 text-primary" />
                  <h3 className="font-medium">Positioning Mode</h3>
                </div>
                <p className="text-sm opacity-80">
                  Toggle drag mode to reposition HUD elements. When enabled, you can drag and drop HUD elements around the screen.
                </p>
                <button
                  className={`mt-2 px-4 py-2 rounded-md ${dragMode ? 'bg-primary text-white' : 'bg-white/10'}`}
                  onClick={() => setDragMode(!dragMode)}
                >
                  {dragMode ? 'Disable Drag Mode' : 'Enable Drag Mode'}
                </button>
              </div>

              <p className="text-sm opacity-70">
                While drag mode is enabled, click and drag any HUD element to reposition it on your screen.
              </p>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Reset Positions</h3>
                <button
                  className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-md transition-colors"
                  onClick={() => {
                    if (confirm('Reset all module positions to default?')) {
                      Object.keys(modules).forEach(key => {
                        updateModuleSettings(key as keyof typeof modules, { position: null });
                      });
                    }
                  }}
                >
                  Reset All Positions
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 flex items-center gap-2 bg-primary hover:bg-primary/90 rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SettingsPanel;
