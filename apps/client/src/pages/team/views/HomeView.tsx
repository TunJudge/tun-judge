import React from 'react';

import ProblemSet from '@shared/ProblemSet';
import Scoreboard from '@shared/Scoreboard';

import ClarificationsList from './ClarificationsList';
import SubmissionsList from './SubmissionsList';

const HomeView: React.FC = () => (
  <div className="flex flex-col items-center gap-4">
    <Scoreboard className="pt-12" compact />
    <div className="grid grid-cols-2 gap-4 px-4 xl:container">
      <div className="flex flex-col gap-4">
        <ProblemSet listMode />
        <ClarificationsList />
      </div>
      <SubmissionsList />
    </div>
  </div>
);

export default HomeView;
