import Ansi from 'ansi-to-react';
import { FC, useCallback, useState } from 'react';
import { Button, Flex, Sheet } from 'tw-react-components';

import { useOnWebSocketEvent } from '@core/hooks';

type JudgeHostLogsViewerProps = {
  hostname?: string;
  onClose: () => void;
};

export const JudgeHostLogsViewer: FC<JudgeHostLogsViewerProps> = ({ hostname, onClose }) => {
  const [logs, setLogs] = useState<string[]>([]);

  const updateLogs = useCallback((logLine: string) => {
    setLogs((logs) => [...logs, logLine]);
    const terminalSegment = document.getElementById('terminal-logs');
    terminalSegment && (terminalSegment.scrollTop = terminalSegment.scrollHeight);
  }, []);

  useOnWebSocketEvent(`judgeHost-${hostname}-logs`, updateLogs);

  return (
    <Sheet open={!!hostname} onOpenChange={(value) => !value && onClose()}>
      <Sheet.Content className="!max-w-7xl">
        <Sheet.Header>
          <Sheet.Title>Judge Host '{hostname}' logs</Sheet.Title>
        </Sheet.Header>
        <Flex
          id="terminal-logs"
          className="gap-0 overflow-auto rounded-md bg-black p-2 text-white"
          direction="column"
          fullHeight
          fullWidth
        >
          {logs.map((log, index) => (
            <Ansi key={index}>{log}</Ansi>
          ))}
        </Flex>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button color="red" onClick={onClose}>
              Close
            </Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
};
