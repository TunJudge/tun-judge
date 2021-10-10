import { Provider } from 'mobx-react';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { rootStore } from './core/stores/RootStore';
import './index.scss';
import Spinner from './pages/shared/Spinner';

ReactDOM.render(
  <Suspense fallback={<Spinner fullScreen />}>
    <Provider store={rootStore}>
      <App />
    </Provider>
  </Suspense>,
  document.getElementById('root')
);
