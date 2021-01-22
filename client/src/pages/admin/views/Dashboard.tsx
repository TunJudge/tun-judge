import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { Container, Header, Icon, Segment, Statistic, Step } from 'semantic-ui-react';
import { Contest } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import { MOMENT_DEFAULT_FORMAT } from '../../shared/extended-form';

const Dashboard: React.FC = observer(() => {
  const {
    publicStore: {
      currentContest,
      totalSubmissions,
      totalPendingSubmissions,
      totalWrongSubmissions,
      totalCorrectSubmissions,
      isCurrentContestActive,
      isCurrentContestStarted,
      isCurrentContestFrozen,
      isCurrentContestOver,
      isCurrentContestUnfrozen,
    },
    contestsStore: { update },
  } = rootStore;

  const setFieldAsNow = async (contest: Contest, timeField: keyof Contest): Promise<void> => {
    contest[timeField] = new Date() as never;
    await update(contest);
  };

  return (
    <Container textAlign="center" style={{ paddingTop: '2rem' }}>
      <Segment>
        <Header size="huge">{currentContest ? currentContest.name : 'No Active Contest'}</Header>
      </Segment>
      {currentContest && (
        <>
          <Segment.Group>
            <Segment as={Header}>Submissions Statistics</Segment>
            <Segment>
              <Statistic.Group widths="4">
                <Statistic>
                  <Statistic.Value>{totalSubmissions}</Statistic.Value>
                  <Statistic.Label>Total</Statistic.Label>
                </Statistic>
                <Statistic color="yellow">
                  <Statistic.Value>{totalPendingSubmissions}</Statistic.Value>
                  <Statistic.Label>Pending</Statistic.Label>
                </Statistic>
                <Statistic color="red">
                  <Statistic.Value>{totalWrongSubmissions}</Statistic.Value>
                  <Statistic.Label>Wrong</Statistic.Label>
                </Statistic>
                <Statistic color="green">
                  <Statistic.Value>{totalCorrectSubmissions}</Statistic.Value>
                  <Statistic.Label>Correct</Statistic.Label>
                </Statistic>
              </Statistic.Group>
            </Segment>
          </Segment.Group>
          <Segment.Group>
            <Segment as={Header}>Control Contest</Segment>
            <Segment>
              <Step.Group widths="5">
                <Step
                  link
                  completed={isCurrentContestActive}
                  disabled={isCurrentContestActive}
                  onClick={() => setFieldAsNow(currentContest, 'activateTime')}
                >
                  <Icon name="check circle outline" />
                  <Step.Content>
                    <Step.Title>Activate</Step.Title>
                    <Step.Description>
                      {moment(currentContest.activateTime).format(MOMENT_DEFAULT_FORMAT)}
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step
                  link
                  completed={isCurrentContestStarted}
                  disabled={isCurrentContestStarted}
                  onClick={() => setFieldAsNow(currentContest, 'startTime')}
                >
                  <Icon name="play circle outline" />
                  <Step.Content>
                    <Step.Title>Start</Step.Title>
                    <Step.Description>
                      {moment(currentContest.startTime).format(MOMENT_DEFAULT_FORMAT)}
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step
                  link
                  completed={isCurrentContestFrozen || isCurrentContestOver}
                  disabled={
                    isCurrentContestFrozen || isCurrentContestOver || !isCurrentContestStarted
                  }
                  onClick={() => setFieldAsNow(currentContest, 'freezeTime')}
                >
                  <Icon name="eye slash outline" />
                  <Step.Content>
                    <Step.Title>Freeze</Step.Title>
                    <Step.Description>
                      {moment(currentContest.freezeTime ?? currentContest.endTime).format(
                        MOMENT_DEFAULT_FORMAT,
                      )}
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step
                  link
                  completed={isCurrentContestOver}
                  disabled={isCurrentContestOver || !isCurrentContestStarted}
                  onClick={() => setFieldAsNow(currentContest, 'endTime')}
                >
                  <Icon name="stop circle outline" />
                  <Step.Content>
                    <Step.Title>Stop</Step.Title>
                    <Step.Description>
                      {moment(currentContest.endTime).format(MOMENT_DEFAULT_FORMAT)}
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step
                  link
                  completed={isCurrentContestUnfrozen}
                  disabled={isCurrentContestUnfrozen || !isCurrentContestFrozen}
                  onClick={() => setFieldAsNow(currentContest, 'unfreezeTime')}
                >
                  <Icon name="eye" />
                  <Step.Content>
                    <Step.Title>Unfreeze</Step.Title>
                    <Step.Description>
                      {moment(currentContest.unfreezeTime ?? currentContest.endTime).format(
                        MOMENT_DEFAULT_FORMAT,
                      )}
                    </Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>
            </Segment>
          </Segment.Group>
        </>
      )}
    </Container>
  );
});

export default Dashboard;
