import { FC, PropsWithChildren, createContext } from 'react';
import { Socket, io } from 'socket.io-client';

export type WebSocketContext = {
  socket: Socket;
};

const socket = io(`/ws`, { transports: ['websocket'] });

export const WebSocketContext = createContext<WebSocketContext | undefined>(undefined);

export const WebSocketContextProvider: FC<PropsWithChildren> = ({ children }) => {
  return <WebSocketContext.Provider value={{ socket }}>{children}</WebSocketContext.Provider>;
};
