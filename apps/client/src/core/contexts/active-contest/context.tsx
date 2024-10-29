import { FC, PropsWithChildren, createContext, useEffect, useState } from 'react';

import { Prisma } from '@prisma/client';

import { useFindManyContest } from '@core/queries';

export type Contest = Prisma.ContestGetPayload<{
  select: {
    id: true;
    name: true;
    shortName: true;
    startTime: true;
    endTime: true;
  };
}>;

export type ActiveContest = {
  activeContests: Contest[];
  currentContest?: Contest;
  setCurrentContest: (contest?: Contest) => void;
};

export const ActiveContestContext = createContext<ActiveContest>({
  activeContests: [],
  currentContest: undefined,
  setCurrentContest: () => undefined,
});

export const ActiveContestProvider: FC<PropsWithChildren> = ({ children }) => {
  const [now, setNow] = useState(new Date());
  const [currentContest, setCurrentContest] = useState<Contest>();

  const { data: contests = [] } = useFindManyContest({
    where: {
      enabled: true,
      activateTime: { lte: now },
    },
    select: { id: true, name: true, shortName: true, startTime: true, endTime: true },
    orderBy: { activateTime: 'asc' },
  });

  useEffect(() => {
    if (import.meta.env.MODE === 'development') return;

    const interval = setInterval(() => {
      setNow(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentContest(contests[0]);
  }, [contests]);

  return (
    <ActiveContestContext.Provider
      value={{ activeContests: contests, currentContest, setCurrentContest }}
    >
      {children}
    </ActiveContestContext.Provider>
  );
};
