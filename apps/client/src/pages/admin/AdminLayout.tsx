import {
  BracesIcon,
  ClipboardListIcon,
  CogIcon,
  GraduationCapIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  TagsIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from 'lucide-react';
import { FC, useMemo } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import {
  Button,
  DropdownMenu,
  Flex,
  Layout,
  SidebarProps,
  useLayoutContext,
} from 'tw-react-components';

import { useAuthContext } from '@core/contexts';

import { version } from '../../../package.json';
import { ContestsList } from './views/contests/ContestsList';
import { ExecutablesList } from './views/executables/ExecutablesList';
import { LanguagesList } from './views/languages/LanguagesList';
import { ProblemView } from './views/problems/ProblemView';
import { ProblemsList } from './views/problems/ProblemsList';
import { TeamCategoriesList } from './views/team-category/TeamCategoriesList';
import { TeamsList } from './views/teams/TeamsList';
import { UsersList } from './views/users/UsersList';

export const AdminLayout: FC = () => {
  const { profile } = useAuthContext();
  const { theme, toggleTheme } = useLayoutContext();

  const sidebarProps: SidebarProps = useMemo(
    () => ({
      smallLogo: 'TJ',
      fullLogo: 'TunJudge',
      items: [
        {
          type: 'group',
          items: [
            // {
            //   pathname: '',
            //   title: 'Home',
            //   Icon: HomeIcon,
            // },
            {
              type: 'item',
              pathname: 'contests',
              title: 'Contests',
              Icon: GraduationCapIcon,
            },
            {
              type: 'item',
              pathname: 'problems',
              title: 'Problems',
              Icon: ClipboardListIcon,
            },
            {
              type: 'item',
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
              type: 'item',
              pathname: 'users',
              title: 'Users',
              Icon: UserRoundIcon,
            },
            {
              type: 'item',
              pathname: 'teams',
              title: 'Teams',
              Icon: UsersRoundIcon,
            },
            {
              type: 'item',
              pathname: 'team-categories',
              title: 'Team Categories',
              Icon: TagsIcon,
            },
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
        },
      ],
    }),
    [],
  );

  return (
    <Layout
      className="p-0"
      sidebarProps={sidebarProps}
      navbarProps={{
        className: 'py-1',
        rightSlot: (
          // <ActiveContestSelector className="rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700" />

          <Flex className="gap-2" align="center">
            <Button
              variant="text"
              prefixIcon={theme === 'dark' ? MoonIcon : SunIcon}
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
                <DropdownMenu.Item className="py-0.5 text-sm font-semibold" disabled>
                  v{version}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </Flex>
        ),
      }}
    >
      <Routes>
        {/* <Route exact path="/" component={Dashboard} />*/}
        <Route path="/contests" element={<ContestsList />} />
        <Route path="/problems" element={<ProblemsList />} />
        <Route path="/problems/:id" element={<ProblemView />} />
        <Route path="/languages" element={<LanguagesList />} />
        <Route path="/executables" element={<ExecutablesList />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/teams" element={<TeamsList />} />
        <Route path="/team-categories" element={<TeamCategoriesList />} />
        {/*<Route exact path="/judge-hosts" component={JudgeHostsList} />
  <Route exact path="/submissions" component={SubmissionsList} />
  <Route path="/submissions/:id" component={SubmissionsView} />
  <Route exact path="/clarifications" component={ClarificationsList} />
  <Route exact path="/scoreboard" component={Scoreboard} />
  <Route render={() => <Redirect to="/" />} /> */}
      </Routes>
    </Layout>
  );
};
