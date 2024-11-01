import { useContext } from 'react';

import { ActiveContestContext } from './context';

export function useActiveContest() {
  const context = useContext(ActiveContestContext);

  if (!context) {
    throw new Error('useActiveContest must be used within a ActiveContestProvider');
  }

  return context;
}
