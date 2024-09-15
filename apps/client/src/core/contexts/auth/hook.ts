import { useContext } from 'react';

import { AuthContext, User } from './context';

export function useAuthContext<T extends User>() {
  return useContext(AuthContext) as AuthContext<T>;
}
