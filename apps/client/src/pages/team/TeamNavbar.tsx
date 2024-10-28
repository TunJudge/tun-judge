import { LogOutIcon, UploadIcon, UserIcon } from 'lucide-react';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, DropdownMenu, ThemeSelector } from 'tw-react-components';

import { NavBar } from '@core/components';
import { useActiveContest, useAuthContext } from '@core/contexts';
import { useTimeLeftToContest } from '@core/hooks';
import { contestStartedAndNotOver } from '@core/utils';

import { ActiveContestSelector } from '../../core/components/ActiveContestSelector';

export const TeamNavbar: FC = () => {
  const location = useLocation();
  const { profile } = useAuthContext();

  const { currentContest } = useActiveContest();
  const timeLeftToContest = useTimeLeftToContest();

  // const [submitFormOpen, setSubmitFormOpen] = useState<boolean>(false);

  const tabs = [
    { name: 'Problem Set', path: '/problems', hide: timeLeftToContest > 0 },
    { name: 'Scoreboard', path: '/scoreboard', hide: timeLeftToContest > 0 },
  ];

  return (
    <>
      <NavBar
        logo={
          <Link className="cursor-pointer text-xl font-medium text-white" to="/">
            TunJudge
          </Link>
        }
        leftItems={tabs.map((tab) => ({
          content: <Link to={tab.path}>{tab.name}</Link>,
          active: tab.path === location.pathname,
          hide: tab.hide,
        }))}
        rightItems={[
          {
            type: 'element',
            hide: !contestStartedAndNotOver(currentContest),
            element: (
              <Button color="green" prefixIcon={UploadIcon}>
                Submit
              </Button>
            ),
          },
          { type: 'element', element: <ActiveContestSelector className="text-white" /> },
          {
            type: 'element',
            element: (
              <DropdownMenu>
                <DropdownMenu.Trigger test-id="navbar-user" asChild>
                  <Button
                    className="bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 active:bg-slate-900"
                    prefixIcon={UserIcon}
                  >
                    {profile?.name ?? '-'}
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <Link to="/logout">
                    <DropdownMenu.Item>
                      <DropdownMenu.Icon icon={LogOutIcon} />
                      Logout
                    </DropdownMenu.Item>
                  </Link>
                </DropdownMenu.Content>
              </DropdownMenu>
            ),
          },
          {
            type: 'element',
            element: (
              <ThemeSelector className="bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 active:bg-slate-900" />
            ),
          },
        ]}
      />
      {/* <SubmitForm
        isOpen={submitFormOpen}
        item={{} as Submission}
        onClose={() => setSubmitFormOpen(false)}
        onSubmit={async (submission) => {
          await sendSubmission(currentContest!.id, profile!.team!.id, submission);
          setSubmitFormOpen(false);
        }}
      /> */}
    </>
  );
};
