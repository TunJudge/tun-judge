import Ansi from 'ansi-to-react';
import { FC, useEffect, useState } from 'react';
import { Sheet } from 'tw-react-components';

type JudgeHostLogsViewerProps = {
  hostname?: string;
  onClose: () => void;
};

export const JudgeHostLogsViewer: FC<JudgeHostLogsViewerProps> = ({ hostname, onClose }) => {
  // const { socket } = useStore<RootStore>('rootStore');

  const [logs, setLogs] = useState<string[]>([]);

  // useEffect(() => {
  //   if (hostname) {
  //     const event = `judgeHost-${hostname}-logs`;
  //     socket.off(event);
  //     socket.on(event, (logLine: string) => {
  //       setLogs((logs) => [...logs, logLine]);
  //       const terminalSegment = document.getElementById('terminal-logs');
  //       terminalSegment && (terminalSegment.scrollTop = terminalSegment.scrollHeight);
  //     });
  //     return () => {
  //       socket.off(event);
  //     };
  //   }
  // }, [hostname, socket]);

  return (
    <Sheet open={!!hostname} onOpenChange={(value) => !value && onClose()}>
      <Sheet.Content className="!max-w-7xl">
        <Sheet.Header>
          <Sheet.Title>Judge Host '{hostname}' logs</Sheet.Title>
        </Sheet.Header>
        <div id="terminal-logs" className="h-96 overflow-auto rounded-md bg-slate-900 text-white">
          {logs.map((log, index) => (
            <span key={index}>
              <Ansi>{log}</Ansi>
              <br />
            </span>
          ))}
        </div>
      </Sheet.Content>
    </Sheet>
  );
};
