import { Menu } from '@headlessui/react';
import { LogoutIcon, UploadIcon, UserIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { contestStartedAndNotOver } from '@core/helpers';
import { Submission } from '@core/models';
import { PublicStore, RootStore, TeamStore, useStore } from '@core/stores';
import ActiveContestSelector from '@shared/ActiveContestSelector';
import { DarkModeSwitcher } from '@shared/DarkModeSwitcher';
import NavBar from '@shared/NavBar';
import SubmitForm from '@shared/SubmitForm';

type Tabs = '' | 'problems' | 'scoreboard';

const TeamNavbar: React.FC = observer(() => {
  const { profile } = useStore<RootStore>('rootStore');
  const { currentContest } = useStore<PublicStore>('publicStore');
  const { sendSubmission } = useStore<TeamStore>('teamsStore');

  const [submitFormOpen, setSubmitFormOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();

  history.listen(() => setCurrentTab(location.pathname.replace(/\/?/g, '')));

  const onLinkClick = (tab: Tabs) => {
    setCurrentTab(tab);
    history.push(`/${tab}`);
  };

  return (
    <>
      <NavBar
        logo={
          <div
            className="cursor-pointer text-xl font-medium text-white"
            onClick={() => onLinkClick('')}
          >
            TunJudge
          </div>
        }
        leftItems={[
          {
            content: 'Home',
            active: currentTab === '',
            onClick: () => onLinkClick(''),
          },
          {
            content: 'Problem Set',
            active: currentTab === 'problems',
            onClick: () => onLinkClick('problems'),
          },
          {
            content: 'Scoreboard',
            active: currentTab === 'scoreboard',
            onClick: () => onLinkClick('scoreboard'),
          },
        ]}
        rightItems={[
          ...(contestStartedAndNotOver(currentContest)
            ? [
                {
                  content: (
                    <div className="flex items-center gap-2">
                      <UploadIcon className="h-5 w-5" />
                      Submit
                    </div>
                  ),
                  active: true,
                  className: 'bg-green-600 hover:bg-green-700',
                  onClick: () => setSubmitFormOpen(true),
                },
              ]
            : []),
          { content: <ActiveContestSelector className="text-white" /> },
          {
            content: (
              <Menu as="div" className="relative">
                <Menu.Button
                  as="div"
                  className="flex cursor-pointer items-center justify-center gap-1 rounded-md hover:bg-gray-700"
                  test-id="navbar-user"
                >
                  <UserIcon className="h-4 w-4" />
                  {profile?.name ?? '-'}
                </Menu.Button>
                <Menu.Items className="absolute left-1/2 mt-4 w-36 -translate-x-1/2 transform gap-2 rounded-md border bg-white p-2 text-black shadow-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  <Menu.Item onClick={() => history.push('/logout')}>
                    <div
                      className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      test-id="logout-btn"
                    >
                      <LogoutIcon className="h-4 w-4" />
                      Logout
                    </div>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ),
          },
          { content: <DarkModeSwitcher /> },
        ]}
      />
      <SubmitForm
        isOpen={submitFormOpen}
        item={{} as Submission}
        onClose={() => setSubmitFormOpen(false)}
        onSubmit={async (submission) => {
          await sendSubmission(currentContest!.id, profile!.team!.id, submission);
          setSubmitFormOpen(false);
        }}
      />
    </>
  );
});

export default TeamNavbar;
