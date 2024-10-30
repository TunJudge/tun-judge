import {
  BracesIcon,
  ClipboardListIcon,
  CogIcon,
  GraduationCapIcon,
  ServerIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from 'lucide-react';
import { FC, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout, Sidebar, SidebarProps } from 'tw-react-components';

import { Scoreboard } from '@core/components';

import { ContestsSection } from './ContestsSection';
import { NavUser } from './NavUser';
import { ContestView } from './views/contests/ContestView';
import { ContestsList } from './views/contests/ContestsList';
import { ExecutablesList } from './views/executables/ExecutablesList';
import { JudgeHostsList } from './views/judge-hosts/JudgeHostsList';
import { LanguagesList } from './views/languages/LanguagesList';
import { ProblemView } from './views/problems/ProblemView';
import { ProblemsList } from './views/problems/ProblemsList';
import { SubmissionsView } from './views/submissions/SubmissionView';
import { SubmissionsList } from './views/submissions/SubmissionsList';
import { TeamCategoriesList } from './views/team-category/TeamCategoriesList';
import { TeamsList } from './views/teams/TeamsList';
import { UsersList } from './views/users/UsersList';

export const AdminLayout: FC = () => {
  const sidebarProps: SidebarProps = useMemo(
    () => ({
      header: (
        <Sidebar.MenuButton size="lg">
          <img
            className="h-8 w-8 rounded-lg"
            src="https://ui-avatars.com/api/?name=Tun_Judge&background=1d4ed8&color=fff"
            alt="TunJudge"
          />
          <span className="text-lg font-semibold">Tun Judge</span>
        </Sidebar.MenuButton>
      ),
      items: [
        {
          type: 'group',
          title: 'Setup',
          items: [
            // {
            //   pathname: '',
            //   title: 'Home',
            //   Icon: HomeIcon,
            // },
            {
              pathname: 'users',
              title: 'Users',
              Icon: UserRoundIcon,
            },
            {
              pathname: 'teams',
              title: 'Teams',
              Icon: UsersRoundIcon,
              items: [
                {
                  pathname: 'categories',
                  title: 'Team Categories',
                },
              ],
            },
            {
              pathname: 'contests',
              title: 'Contests',
              Icon: GraduationCapIcon,
            },
            {
              pathname: 'problems',
              title: 'Problems',
              Icon: ClipboardListIcon,
            },
            {
              pathname: 'languages',
              title: 'Languages',
              Icon: BracesIcon,
            },
            {
              pathname: 'executables',
              title: 'Executables',
              Icon: CogIcon,
            },
            {
              pathname: 'judge-hosts',
              title: 'Judge Hosts',
              Icon: ServerIcon,
            },
          ],
        },
      ],
      extraContent: <ContestsSection />,
      footer: <NavUser />,
    }),
    [],
  );

  return (
    <Layout className="p-0" sidebarProps={sidebarProps}>
      <Routes>
        {/* <Route exact path="/" component={Dashboard} />*/}
        <Route path="users" element={<UsersList />} />
        <Route path="teams" element={<TeamsList />} />
        <Route path="teams/categories" element={<TeamCategoriesList />} />
        <Route path="contests" element={<ContestsList />} />
        <Route path="contests/:contestId" element={<ContestView />}>
          <Route path="submissions" element={<SubmissionsList />} />
          <Route path="submissions/:submissionId" element={<SubmissionsView />} />
          <Route path="clarifications" element={'Clarifications'} />
          <Route path="scoreboard" element={<Scoreboard />} />
          <Route path="*" element={<Navigate to="submissions" replace />} />
        </Route>
        <Route path="problems" element={<ProblemsList />} />
        <Route path="problems/:id" element={<ProblemView />} />
        <Route path="languages" element={<LanguagesList />} />
        <Route path="executables" element={<ExecutablesList />} />
        <Route path="judge-hosts" element={<JudgeHostsList />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </Layout>
  );
};
