import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FetchFn } from '@zenstackhq/tanstack-query/runtime-v5';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutContextProvider, Spinner } from 'tw-react-components';

import Root from './Root';
import { AuthContextProvider, ToastContextProvider } from './core';
import { Provider as ZenStackHooksProvider } from './hooks';
import './index.scss';

const queryClient = new QueryClient();
const myFetch: FetchFn = (url, options) => {
  options = options ?? {};
  options.credentials = 'include';
  return fetch(url, options);
};

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <StrictMode>
    <Suspense fallback={<Spinner fullScreen />}>
      <QueryClientProvider client={queryClient}>
        <ZenStackHooksProvider value={{ endpoint: '/api/rpc', fetch: myFetch }}>
          <LayoutContextProvider>
            <AuthContextProvider>
              <ToastContextProvider>
                <Root />
              </ToastContextProvider>
            </AuthContextProvider>
          </LayoutContextProvider>
        </ZenStackHooksProvider>
      </QueryClientProvider>
    </Suspense>
  </StrictMode>,
);
