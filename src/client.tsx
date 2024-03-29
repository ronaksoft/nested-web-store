import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
const { Router, browserHistory } = require('react-router');
import { syncHistoryWithStore } from 'react-router-redux';
const { ReduxAsyncConnect } = require('redux-connect');
import { configureStore } from './app/redux/store';

import routes from './app/routes';
// const localeData: any = require('./app/locales/data.json');
const store = configureStore(
  browserHistory,
  window.__INITIAL_STATE__,
);
const history = syncHistoryWithStore(browserHistory, store);
const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;
console.log('__INITIAL_DATA__', window.__INITIAL_DATA__);

if (!window.__INITIAL_DATA__) {
  window.__INITIAL_DATA__ = {};
}

ReactDOM.render(
  <Provider store={store} key="provider">
      <Router
        history={history}
        render={connectedCmp}
      >
        {routes}
      </Router>
  </Provider>,
  document.getElementById('app'),
);
