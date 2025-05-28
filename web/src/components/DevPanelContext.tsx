import React, { createContext, useContext } from 'react';

interface DevPanelContextType {
  updateValue: (path: string, value: any) => void;
  hudData: any;
}

export const DevPanelContext = createContext<DevPanelContextType | null>(null);

export const useDevPanel = () => {
  const context = useContext(DevPanelContext);
  if (!context) {
    throw new Error('useDevPanel must be used within DevPanelProvider');
  }
  return context;
};
