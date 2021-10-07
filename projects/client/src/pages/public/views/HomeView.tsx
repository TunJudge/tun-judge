import { observer } from 'mobx-react';
import React from 'react';
import { rootStore } from '../../../core/stores/RootStore';
import { NoActiveContest } from '../../shared/NoActiveContest';
import Scoreboard from '../../shared/Scoreboard';

const HomeView: React.FC = observer(() => {
  const {
    publicStore: { currentContest },
  } = rootStore;

  return currentContest ? <Scoreboard contest={currentContest} /> : <NoActiveContest />;
});

export default HomeView;
