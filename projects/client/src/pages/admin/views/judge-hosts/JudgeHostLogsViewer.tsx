import Ansi from 'ansi-to-react';
import React, { useEffect, useState } from 'react';
import { rootStore } from '../../../../core/stores/RootStore';
import { SimpleDialog } from '../../../shared/dialogs';

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
    <SimpleDialog title={`Judge Host '${hostname}' logs`} isOpen={!!hostname} onClose={dismiss}>
      <div id="terminal-logs" className="text-white bg-gray-900 rounded-md h-96 overflow-auto">
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
