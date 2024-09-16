import { LogOutIcon, MoonIcon, SunIcon, UserIcon, UsersIcon } from 'lucide-react';
import { observer } from 'mobx-react';
import React, { useMemo } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import {
  Button,
  DropdownMenu,
  Flex,
  Layout,
  SidebarItem,
  useLayoutContext,
} from 'tw-react-components';

import { useAuthContext } from '../../core';
import TeamsList from './views/teams/TeamsList';
import UsersList from './views/users/UsersList';

const AdminLayout: React.FC = observer(() => {
  const { profile } = useAuthContext();
  const { theme, toggleTheme } = useLayoutContext();

  const darkMode = theme === 'dark';
  const totalPendingSubmissions = 0;
  console.log('AdminLayout');

  const items: SidebarItem[] = useMemo(
    () => [
      // {
      //   pathname: '',
      //   title: 'Home',
      //   Icon: HomeIcon,
      // },
      // {
      //   pathname: 'contests',
      //   title: 'Contests',
      //   Icon: AcademicCapIcon,
      // },
      // {
      //   pathname: 'problems',
      //   title: 'Problems',
      //   Icon: ClipboardListIcon,
      // },
      // {
      //   pathname: 'languages',
      //   title: 'Languages',
      //   Icon: CodeIcon,
      // },
      // {
      //   pathname: 'executables',
      //   title: 'Executables',
      //   Icon: CogIcon,
      // },
      {
        pathname: 'users',
        title: 'Users',
        Icon: UserIcon,
      },
      {
        pathname: 'teams',
        title: 'Teams',
        Icon: UsersIcon,
      },
      // {
      //   pathname: 'team-categories',
      //   title: 'Team Categories',
      //   Icon: TagIcon,
      // },
      // {
      //   pathname: 'judge-hosts',
      //   title: 'Judge Hosts',
      //   Icon: ServerIcon,
      // },
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
    [totalPendingSubmissions],
  );

  return (
    <Layout
      sidebarProps={{
        items,
        smallLogo: 'TJ',
        fullLogo: 'TunJudge',
      }}
      navbarProps={{
        rightSlot: (
          // <ActiveContestSelector className="rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700" />

          <Flex className="gap-2 pr-2" align="center">
            <Button
              variant="text"
              prefixIcon={darkMode ? MoonIcon : SunIcon}
              onClick={toggleTheme}
            />
            <DropdownMenu>
              <DropdownMenu.Trigger>
                <img
                  className="h-8 w-8 rounded-lg"
                  src={`https://ui-avatars.com/api/?name=${profile?.name ?? '-'}`}
                  alt={profile?.name}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-48" align="end">
                <DropdownMenu.Item className="flex-col items-start gap-1">
                  <span>{profile?.name}</span>
                  <span className="text-sm leading-3 text-slate-400 xl:leading-4">
                    {profile?.role.description}
                  </span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <Link className="flex w-full items-center gap-2" to="logout">
                  <DropdownMenu.Item className="w-full cursor-pointer">
                    <DropdownMenu.Icon icon={LogOutIcon} />
                    Logout
                  </DropdownMenu.Item>
                </Link>
                <DropdownMenu.Separator />
                {/* <DropdownMenu.Item className="py-0.5 text-sm font-semibold" disabled>
                  v{version}
                </DropdownMenu.Item> */}
              </DropdownMenu.Content>
            </DropdownMenu>
          </Flex>
        ),
      }}
    >
      <Routes>
        {/* <Route exact path="/" component={Dashboard} />
  <Route exact path="/contests" component={ContestsList} />
  <Route exact path="/problems" component={ProblemsList} />
  <Route path="/problems/:id" component={ProblemView} />
  <Route exact path="/languages" component={LanguagesList} />
  <Route exact path="/executables" component={ExecutablesList} />*/}
        <Route path="/users" element={<UsersList />} />
        <Route path="/teams" element={<TeamsList />} />
        {/*<Route exact path="/team-categories" component={TeamCategoriesList} />
  <Route exact path="/judge-hosts" component={JudgeHostsList} />
  <Route exact path="/submissions" component={SubmissionsList} />
  <Route path="/submissions/:id" component={SubmissionsView} />
  <Route exact path="/clarifications" component={ClarificationsList} />
  <Route exact path="/scoreboard" component={Scoreboard} />
  <Route render={() => <Redirect to="/" />} /> */}
      </Routes>
    </Layout>
  );
});

export default AdminLayout;
