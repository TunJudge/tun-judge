import { useContext } from 'react';

import { WebSocketContext } from './context';

export function useWebSocketContext(): WebSocketContext {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketContextProvider');
  }

  return context;
}
