import { useContext } from 'react';

import { ActiveContest, ActiveContestContext } from './context';

export function useActiveContest() {
  return useContext(ActiveContestContext) as ActiveContest;
}
