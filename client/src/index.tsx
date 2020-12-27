import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { rootStore } from './core/stores/RootStore';
import Spinner from './pages/shared/Spinner';

ReactDOM.render(
  <Provider store={rootStore}>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
