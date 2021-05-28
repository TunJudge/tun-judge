import { observer } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Header, Icon, Menu, Segment } from 'semantic-ui-react';
import { dateComparator, isSubmissionClaimedByMe } from '../../../../core/helpers';
import { Judging, Submission } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';

const SubmissionViewHeader: React.FC<{ submission: Submission }> = observer(({ submission }) => {
  const history = useHistory();
  const judging = submission.judgings
    .slice()
    .sort(dateComparator<Judging>('startTime', true))
    .shift();
  const {
    profile,
    submissionsStore: { fetchById, ignore, unIgnore, rejudge, claim, unClaim, markVerified },
  } = rootStore;

  return (
    <Segment as={Menu} style={{ padding: 0 }} borderless>
      <Menu.Item>
        <Header>Submission {submission.id}</Header>
      </Menu.Item>
      <Menu.Item position="right">
        {judging?.result && (
          <Button
            basic
            color="linkedin"
            className="mr-2"
            onClick={async () => {
              await (submission!.valid ? ignore : unIgnore)(submission!.id);
              await fetchById(submission!.id);
            }}
          >
            {submission.valid ? 'Ignore' : 'UnIgnore'}
          </Button>
        )}
        {judging?.result && judging.verified && (
          <Button
            basic
            color="red"
            className="mr-2"
            onClick={async () => {
              await rejudge(submission!.id);
              await fetchById(submission!.id);
            }}
          >
            Rejudge
          </Button>
        )}
        {judging?.result && !judging.verified && (
          <>
            <Button
              basic
              color="blue"
              className="mr-2"
              onClick={async () => {
                if (isSubmissionClaimedByMe(judging, profile)) {
                  await unClaim(submission!.id);
                } else {
                  await claim(submission!.id);
                }
                await fetchById(submission!.id);
              }}
            >
              {isSubmissionClaimedByMe(judging, profile) ? 'UnClaim' : 'Claim'}
            </Button>
            <Button
              basic
              color="green"
              className="mr-2"
              onClick={async () => {
                await markVerified(submission!.id);
                history.push('/submissions');
              }}
            >
              Mark Verified
            </Button>
          </>
        )}
        <Button color="blue" icon onClick={() => fetchById(submission!.id)}>
          <Icon name="refresh" />
        </Button>
      </Menu.Item>
    </Segment>
  );
});

export default SubmissionViewHeader;
