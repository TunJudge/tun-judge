import React, { CSSProperties, useEffect, useState } from 'react';
import { rootStore } from '../../core/stores/RootStore';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { formatRestTime, getContestTimeProgress } from '../../core/helpers';

const progressBarStyle: CSSProperties = {
  position: 'absolute',
  marginLeft: '-1.14286em',
  height: '100%',
};

const ActiveContestSelector: React.FC = observer(() => {
  const [contestTimeProgress, setContestTimeProgress] = useState<number>(0);
  const [restTime, setRestTime] = useState<number>(0);
  const { setCurrentContest, contests, currentContest } = rootStore.publicStore;

  useEffect(() => {
    if (currentContest) {
      setRestTime((new Date(currentContest.endTime).getTime() - Date.now()) / 1000);
      setContestTimeProgress(getContestTimeProgress(currentContest));
    }
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
          <div style={{ zIndex: 1 }}>{formatRestTime(restTime)}</div>
        </Menu.Item>
      )}
    </>
  );
});

export default ActiveContestSelector;
