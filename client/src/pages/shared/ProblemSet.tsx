import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Icon, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { rootStore } from '../../core/stores/RootStore';
import { ContestProblem, Submission } from '../../core/models';
import SubmitForm from '../team/views/SubmitForm';
import PDFModalViewer from './PDFModalViewer';
import { contestNotOver, formatBytes, isEmpty } from '../../core/helpers';

type ListLayout = 'list' | 'th';

const ProblemSet: React.FC = observer(() => {
  const [submission, setSubmission] = useState<Submission | undefined>(undefined);
  const [pdfData, setPdfData] = useState<string | undefined>(undefined);
  const [listLayout, setListLayout] = useState<ListLayout>(
    (localStorage.getItem('problems.listLayout') as ListLayout) ?? 'th',
  );
  const {
    publicStore: { currentContest, problems, fetchProblems },
    teamStore: { submissions, fetchSubmissions },
    profile,
  } = rootStore;

  useEffect(() => {
    currentContest && fetchProblems(currentContest.id);
  }, [fetchProblems, currentContest]);

  useEffect(() => {
    if (profile?.role?.name === 'team' && currentContest) {
      fetchSubmissions(currentContest.id, profile.team.id);
    }
  }, [profile, currentContest, fetchSubmissions]);

  const getProblemColor = (problem: ContestProblem): string => {
    if (isEmpty(submissions)) return '';
    const submission = submissions.filter((s) => s.problem.id === problem.problem.id);
    if (submission.some((s) => s.judgings.find((j) => j.valid && j.endTime && j.result === 'AC'))) {
      return '#B3FFC2';
    }
    if (
      submission.some((s) =>
        s.judgings.find((j) => j.valid && j.endTime && j.result && j.result !== 'AC'),
      )
    ) {
      return '#FFC2C2';
    }
    return '';
  };

  return (
    <Container>
      <Button
        floated="right"
        style={{ marginLeft: 0 }}
        icon={<Icon name={listLayout === 'list' ? 'th' : 'list'} />}
        onClick={() => {
          setListLayout(listLayout === 'list' ? 'th' : 'list');
          localStorage.setItem('problems.listLayout', listLayout === 'list' ? 'th' : 'list');
        }}
      />
      <h1 style={{ marginTop: '1rem', marginBottom: '3rem', textAlign: 'center' }}>
        Contest Problems
      </h1>
      <Card.Group centered stackable itemsPerRow={listLayout === 'list' ? 1 : 4}>
        {problems.map((problem) => (
          <Card fluid key={problem.shortName}>
            <Card.Content style={{ backgroundColor: getProblemColor(problem) }}>
              <Image
                floated="right"
                style={{
                  height: '23px',
                  width: '23px',
                  borderRadius: '50%',
                  backgroundColor: problem.color,
                }}
              />
              <Card.Header>
                {problem.shortName} - {problem.problem.name}
              </Card.Header>
              <Card.Meta>
                Limits: {problem.problem.timeLimit}s /{' '}
                {formatBytes(problem.problem.memoryLimit * 1024)}
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Button.Group fluid widths="8">
                {profile?.team && contestNotOver(currentContest) && (
                  <Button
                    basic
                    color="green"
                    onClick={() => setSubmission({ problem: problem.problem } as Submission)}
                  >
                    Submit
                  </Button>
                )}
                <Button
                  basic
                  color="blue"
                  onClick={() => setPdfData(problem.problem.file.content.payload)}
                >
                  PDF
                </Button>
              </Button.Group>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
      {submission && <SubmitForm item={submission} dismiss={() => setSubmission(undefined)} />}
      {pdfData && <PDFModalViewer data={pdfData} dismiss={() => setPdfData(undefined)} />}
    </Container>
  );
});

export default ProblemSet;
