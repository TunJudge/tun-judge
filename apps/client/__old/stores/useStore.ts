import { MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';

import { Stores } from '.';

export function useStore<T>(name: keyof Stores): T {
  return useContext(MobXProviderContext)[name] as T;
}
