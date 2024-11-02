import { useEffect } from 'react';

import { WebSocketEvent } from '@tun-judge/shared';

import { useWebSocketContext } from '@core/contexts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOnWebSocketEvent<T extends (...args: any[]) => any>(
  event: WebSocketEvent,
  callback: T,
) {
  const { socket } = useWebSocketContext();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
}
