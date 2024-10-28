import { useEffect, useState } from 'react';

import { useActiveContest } from '@core/contexts';

let interval: NodeJS.Timeout | undefined = undefined;

export function useTimeLeftToContest(): number {
  const { currentContest } = useActiveContest();

  const [timeLeft, setTimeLeft] = useState(Infinity);

  useEffect(() => {
    if (!currentContest) {
      setTimeLeft(Infinity);
      return;
    }

    const startTime = new Date(currentContest.startTime).getTime();
    const now = Date.now();
    if (now < startTime) {
      interval && clearInterval(interval);

      setTimeLeft((startTime - now) / 1000);

      interval = setInterval(() => {
        const startTime = new Date(currentContest.startTime).getTime();
        const now = Date.now();

        if (now < startTime) {
          setTimeLeft((startTime - now) / 1000);
        } else {
          window.location.reload();
        }
      }, 1000);
    } else if (interval) {
      window.location.reload();
    } else {
      setTimeLeft(0);
    }
    return () => interval && clearInterval(interval);
  }, [currentContest]);

  return timeLeft;
}
