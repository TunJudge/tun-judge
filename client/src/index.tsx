import { Provider } from 'mobx-react';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import { rootStore } from './core/stores/RootStore';
import './index.css';
import Spinner from './pages/shared/Spinner';

ReactDOM.render(
  <Provider store={rootStore}>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </Provider>,
  document.getElementById('root'),
);
