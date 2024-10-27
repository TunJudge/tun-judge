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
import { Route, Routes } from 'react-router-dom';
import { Layout, Sidebar, SidebarProps } from 'tw-react-components';

import { NavUser } from './NavUser';
import { ContestsList } from './views/contests/ContestsList';
import { ExecutablesList } from './views/executables/ExecutablesList';
import { JudgeHostsList } from './views/judge-hosts/JudgeHostsList';
import { LanguagesList } from './views/languages/LanguagesList';
import { ProblemView } from './views/problems/ProblemView';
import { ProblemsList } from './views/problems/ProblemsList';
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
            // {
            //   pathname: 'submissions',
            //   title: 'Submissions',
            //   Icon: PaperAirplaneIcon,
            //   label:
            //     totalPendingSubmissions > 0 ? (
            //       <div className="rounded-md bg-yellow-500 px-2 py-0.5 text-white">
            //         {totalPendingSubmissions}
            //       </div>
            //     ) : undefined,
            // },
            // {
            //   pathname: 'clarifications',
            //   title: 'Clarifications',
            //   Icon: ChatIcon,
            // },
            // {
            //   pathname: 'scoreboard',
            //   title: 'Scoreboard',
            //   Icon: ChartBarIcon,
            // },
          ],
        },
      ],
      footer: <NavUser />,
    }),
    [],
  );

  return (
    <Layout
      className="p-0"
      sidebarProps={sidebarProps}
      // <ActiveContestSelector className="rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700" />
    >
      <Routes>
        {/* <Route exact path="/" component={Dashboard} />*/}
        <Route path="/users" element={<UsersList />} />
        <Route path="/teams" element={<TeamsList />} />
        <Route path="/teams/categories" element={<TeamCategoriesList />} />
        <Route path="/contests" element={<ContestsList />} />
        <Route path="/problems" element={<ProblemsList />} />
        <Route path="/problems/:id" element={<ProblemView />} />
        <Route path="/languages" element={<LanguagesList />} />
        <Route path="/executables" element={<ExecutablesList />} />
        <Route path="/judge-hosts" element={<JudgeHostsList />} />
        {/*
        <Route exact path="/submissions" component={SubmissionsList} />
        <Route path="/submissions/:id" component={SubmissionsView} />
        <Route exact path="/clarifications" component={ClarificationsList} />
        <Route exact path="/scoreboard" component={Scoreboard} />
        <Route render={() => <Redirect to="/" />} />
        */}
      </Routes>
    </Layout>
  );
};
