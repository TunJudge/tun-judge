import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { formatRestTime } from '../../core/helpers';

const ContestCountdown: React.FC<{ leftTime: number }> = ({ leftTime }) => (
  <Container textAlign="center" style={{ paddingTop: '10rem' }}>
    <Header style={{ fontSize: '3rem' }}>Contest starts after</Header>
    <Header style={{ fontSize: '10rem' }}>{formatRestTime(leftTime)}</Header>
  </Container>
);

export default ContestCountdown;
