import { ClarificationsStore } from './ClarificationsStore';
import { ContestsStore } from './ContestsStore';
import { ExecutablesStore } from './ExecutablesStore';
import { JudgeHostsStore } from './JudgeHostsStore';
import { LanguagesStore } from './LanguagesStore';
import { ProblemsStore } from './ProblemsStore';
import { PublicStore } from './PublicStore';
import { RootStore } from './RootStore';
import { SubmissionsStore } from './SubmissionsStore';
import { TeamCategoriesStore } from './TeamCategoriesStore';
import { TeamStore } from './TeamStore';
import { TeamsStore } from './TeamsStore';
import { TestcasesStore } from './TestcasesStore';
import { UsersStore } from './UsersStore';

export type Stores = {
  rootStore: RootStore;
  publicStore: PublicStore;
  teamStore: TeamStore;
  usersStore: UsersStore;
  teamsStore: TeamsStore;
  contestsStore: ContestsStore;
  problemsStore: ProblemsStore;
  testcasesStore: TestcasesStore;
  languagesStore: LanguagesStore;
  judgeHostsStore: JudgeHostsStore;
  executablesStore: ExecutablesStore;
  submissionsStore: SubmissionsStore;
  teamCategoriesStore: TeamCategoriesStore;
  clarificationsStore: ClarificationsStore;
};
