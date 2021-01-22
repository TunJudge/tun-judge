import React, { CSSProperties, useEffect, useState } from 'react';
import { rootStore } from '../../core/stores/RootStore';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { formatRestTime, getContestTimeProgress } from '../../core/helpers';
import { Contest } from '../../core/models';

let interval: NodeJS.Timeout | undefined = undefined;

const progressBarStyle: CSSProperties = {
  position: 'absolute',
  marginLeft: '-1.14286em',
  height: '100%',
};

const ActiveContestSelector: React.FC = observer(() => {
  const [contestTimeProgress, setContestTimeProgress] = useState<number>(0);
  const [restTime, setRestTime] = useState<number>(0);
  const [contestStarted, setContestStarted] = useState<boolean>(false);
  const { setCurrentContest, contests, currentContest } = rootStore.publicStore;

  const updateRestTime = (contest: Contest): void => {
    const startTime = new Date(contest.startTime).getTime();
    const endTime = new Date(contest.endTime).getTime();
    const now = Date.now();
    setContestStarted(now >= startTime);
    setRestTime((now < startTime ? startTime - now : endTime - now) / 1000);
    setContestTimeProgress(getContestTimeProgress(contest));
  };

  useEffect(() => {
    if (currentContest) {
      updateRestTime(currentContest);
      interval && clearInterval(interval);
      interval = setInterval(() => updateRestTime(currentContest), 1000);
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [currentContest]);

  return (
    <>
      <Dropdown
        item
        floating
        text={currentContest?.shortName ?? 'No Active Contests'}
        header={<Dropdown.Header>Change contest</Dropdown.Header>}
        value={currentContest?.id}
        options={contests.map((c) => ({ key: c.id, value: c.id, text: c.shortName }))}
        onChange={(_, { value }) => setCurrentContest(value as number)}
      />
      {currentContest && (
        <Menu.Item style={{ backgroundColor: 'rgba(33, 133, 208, .2)' }}>
          <div
            className="progress-bar"
            style={{
              ...progressBarStyle,
              width: `${contestTimeProgress}%`,
              backgroundColor: contestTimeProgress === 100 ? '#21ba45' : '#2185d0',
            }}
          />
          <Icon name="clock" />
          <div style={{ zIndex: 1 }}>
            {!contestStarted && '- '}
            {formatRestTime(restTime)}
          </div>
        </Menu.Item>
      )}
    </>
  );
});

export default ActiveContestSelector;
