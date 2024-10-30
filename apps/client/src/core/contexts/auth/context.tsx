import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Prisma } from '@prisma/client';

import { request } from '../../utils';

export type User = Prisma.UserGetPayload<{ include: { role: true; team: true } }>;

export const AuthContext = createContext<AuthContext<User>>({
  connected: false,
  isUserAdmin: false,
  isUserJury: false,
  setLastConnectedTime: () => undefined,
  checkUserRole: () => false,
});

export type AuthContext<T extends User> = {
  connected: boolean;
  profile?: T;
  isUserAdmin: boolean;
  isUserJury: boolean;
  setLastConnectedTime: (time: number | undefined) => void;
  checkUserRole: (role: string) => boolean;
};

const SESSION_LENGTH = 24 * 60 * 60 * 1000;
const LAST_CONNECTED_TIME_KEY = 'lastConnectedTime';

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const storedLastConnectedTime = localStorage.getItem(LAST_CONNECTED_TIME_KEY);
  const [lastConnectedTime, setLastConnectedTime] = useState<number | undefined>(
    storedLastConnectedTime ? parseInt(storedLastConnectedTime) : undefined,
  );

  const [profile, setProfile] = useState<User | undefined>();
  const connected = useMemo(
    () =>
      lastConnectedTime
        ? Date.now() - new Date(lastConnectedTime).getTime() < SESSION_LENGTH
        : false,
    [lastConnectedTime],
  );

  const checkUserRole = useCallback((role: string) => profile?.roleName === role, [profile]);

  useEffect(() => {
    lastConnectedTime
      ? localStorage.setItem(LAST_CONNECTED_TIME_KEY, JSON.stringify(lastConnectedTime))
      : localStorage.removeItem(LAST_CONNECTED_TIME_KEY);
  }, [lastConnectedTime]);

  useEffect(() => {
    if (connected) {
      request<User>(`api/current`)
        .then(setProfile)
        .catch((error) => {
          if (error.statusCode) {
            setProfile(undefined);
            setLastConnectedTime(undefined);
          }
        });
    }
  }, [connected]);

  return (
    <AuthContext.Provider
      value={{
        connected,
        profile,
        isUserAdmin: checkUserRole('admin'),
        isUserJury: checkUserRole('jury') || checkUserRole('admin'),
        setLastConnectedTime,
        checkUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
