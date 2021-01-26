import Ansi from 'ansi-to-react';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Segment } from 'semantic-ui-react';
import { rootStore } from '../../../../core/stores/RootStore';

type JudgeHostLogsViewerProps = { hostname?: string; dismiss: () => void };

const JudgeHostLogsViewer: React.FC<JudgeHostLogsViewerProps> = ({ hostname, dismiss }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const { socket } = rootStore;

  useEffect(() => {
    if (hostname) {
      const event = `judgeHost-${hostname}-logs`;
      socket.off(event);
      socket.on(event, (logLine: string) => {
        setLogs((logs) => [...logs, logLine]);
        const terminalSegment = document.getElementById('terminal-logs');
        terminalSegment && (terminalSegment.scrollTop = terminalSegment.scrollHeight);
      });
      return () => {
        socket.off(event);
      };
    }
  }, [hostname, socket]);

  return (
    <Modal open={!!hostname} onClose={dismiss} size="large">
      <Modal.Header>Judge Host &apos;{hostname}&apos; logs</Modal.Header>
      <Modal.Content>
        <Segment id="terminal-logs" inverted style={{ height: 400, overflowY: 'auto' }}>
          {logs.map((log, index) => (
            <span key={index}>
              <Ansi>{log}</Ansi>
              <br />
            </span>
          ))}
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default JudgeHostLogsViewer;
