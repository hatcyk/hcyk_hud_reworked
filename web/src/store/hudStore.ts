import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PlayerData = {
  health: number;
  armor: number;
  stamina: number;
  hunger: number;
  thirst: number;
  speed: number;
  fuel: number;
  street: string;
  area: string;
}

type ModuleSettings = {
  enabled: boolean;
  position: { x: number; y: number } | null;
  scale: number;
  opacity: number;
}

type ModulesConfig = {
  health: ModuleSettings;
  armor: ModuleSettings;
  stamina: ModuleSettings;
  hunger: ModuleSettings;
  thirst: ModuleSettings;
  statusIcons: ModuleSettings;
  minimap: ModuleSettings;
  speedometer: ModuleSettings;
}

type ThemeSettings = {
  primary: string;
  secondary: string;
  accent: string;
  darkMode: boolean;
  glassEffect: boolean;
  roundedCorners: boolean;
}

type HudState = {
  playerData: PlayerData;
  modules: ModulesConfig;
  theme: ThemeSettings;
  updatePlayerData: (data: Partial<PlayerData>) => void;
  updateModuleSettings: (module: keyof ModulesConfig, settings: Partial<ModuleSettings>) => void;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
  loadSettings: () => void;
}

const DEFAULT_PLAYER_DATA: PlayerData = {
  health: 100,
  armor: 0,
  stamina: 100,
  hunger: 100,
  thirst: 100,
  speed: 0,
  fuel: 100,
  street: 'Loading...',
  area: 'Loading...'
};

const DEFAULT_MODULE_SETTINGS: ModuleSettings = {
  enabled: true,
  position: null,
  scale: 1,
  opacity: 1
};

const DEFAULT_MODULES_CONFIG: ModulesConfig = {
  health: { ...DEFAULT_MODULE_SETTINGS },
  armor: { ...DEFAULT_MODULE_SETTINGS },
  stamina: { ...DEFAULT_MODULE_SETTINGS },
  hunger: { ...DEFAULT_MODULE_SETTINGS },
  thirst: { ...DEFAULT_MODULE_SETTINGS },
  statusIcons: { ...DEFAULT_MODULE_SETTINGS },
  minimap: { ...DEFAULT_MODULE_SETTINGS },
  speedometer: { ...DEFAULT_MODULE_SETTINGS }
};

const DEFAULT_THEME: ThemeSettings = {
  primary: '56, 189, 248', // sky-400
  secondary: '14, 165, 233', // sky-500
  accent: '249, 115, 22', // orange-500
  darkMode: true,
  glassEffect: true,
  roundedCorners: true
};

export const useHudStore = create<HudState>()(
  persist(
    (set) => ({
      playerData: DEFAULT_PLAYER_DATA,
      modules: DEFAULT_MODULES_CONFIG,
      theme: DEFAULT_THEME,

      updatePlayerData: (data) => set((state) => ({
        playerData: { ...state.playerData, ...data }
      })),

      updateModuleSettings: (module, settings) => set((state) => ({
        modules: {
          ...state.modules,
          [module]: { ...state.modules[module], ...settings }
        }
      })),

      updateTheme: (settings) => set((state) => ({
        theme: { ...state.theme, ...settings }
      })),

      resetSettings: () => set({
        modules: DEFAULT_MODULES_CONFIG,
        theme: DEFAULT_THEME
      }),

      loadSettings: () => {
        // In a real implementation, this might fetch settings from localStorage
        // or make an API call to the FiveM resource
        console.log('Loading settings');
      }
    }),
    {
      name: 'hcyk-hud-settings',
      partialize: (state) => ({
        modules: state.modules,
        theme: state.theme
      }),
    }
  )
);
