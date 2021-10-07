import { observer } from 'mobx-react';
import React from 'react';
import { rootStore } from '../../../core/stores/RootStore';
import ProblemSet from '../../shared/ProblemSet';
import Scoreboard from '../../shared/Scoreboard';
import ClarificationsList from './ClarificationsList';
import SubmissionsList from './SubmissionsList';

const HomeView: React.FC = observer(() => {
  const {
    publicStore: { currentContest },
  } = rootStore;

  return (
    <div className="flex flex-col items-center gap-4">
      <Scoreboard contest={currentContest!} className="pt-12" compact />
      <div className="xl:container grid grid-cols-2 gap-4 px-4">
        <div className="flex flex-col gap-4">
          <ProblemSet listMode />
          <ClarificationsList />
        </div>
        <SubmissionsList />
      </div>
    </div>
  );
});

export default HomeView;
