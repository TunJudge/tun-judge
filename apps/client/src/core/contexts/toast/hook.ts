import { useContext } from 'react';

import { ToastContext } from './context';

export function useToastContext(): ToastContext {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToastContext must be used within a ToastContextProvider');
  }

  return context;
}
