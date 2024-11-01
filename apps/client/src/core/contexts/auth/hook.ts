import { useContext } from 'react';

import { AuthContext, User } from './context';

export function useAuthContext<T extends User>() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within a AuthContextProvider');
  }

  return context as AuthContext<T>;
}
