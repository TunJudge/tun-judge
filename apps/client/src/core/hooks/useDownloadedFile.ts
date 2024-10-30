import { useEffect, useState } from 'react';

import { downloadFile } from '@core/utils';

export function useDownloadedFile(fileName?: string, defaultContent?: string) {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    if (!fileName) return;

    (async () => {
      const content = await downloadFile(fileName);

      setContent(content);
    })();
  }, [fileName]);

  return content;
}
