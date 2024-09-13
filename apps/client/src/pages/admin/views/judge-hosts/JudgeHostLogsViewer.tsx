import Ansi from 'ansi-to-react';
import React, { useEffect, useState } from 'react';

import { RootStore, useStore } from '@core/stores';
import { SimpleDialog } from '@shared/dialogs';

type JudgeHostLogsViewerProps = { hostname?: string; dismiss: () => void };

const JudgeHostLogsViewer: React.FC<JudgeHostLogsViewerProps> = ({ hostname, dismiss }) => {
  const { socket } = useStore<RootStore>('rootStore');

  const [logs, setLogs] = useState<string[]>([]);

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
    <SimpleDialog title={`Judge Host '${hostname}' logs`} isOpen={!!hostname} onClose={dismiss}>
      <div id="terminal-logs" className="h-96 overflow-auto rounded-md bg-gray-900 text-white">
        {logs.map((log, index) => (
          <span key={index}>
            <Ansi>{log}</Ansi>
            <br />
          </span>
        ))}
      </div>
    </SimpleDialog>
  );
};

export default JudgeHostLogsViewer;
