import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
const { Router, hashHistory } = require('react-router');
// import { syncHistoryWithStore } from 'react-router-redux';
const { ReduxAsyncConnect } = require('redux-connect');
import { configureStore } from './app/redux/store';
import 'isomorphic-fetch';
import routes from './app/routes';
import {IntlProvider} from 'react-intl';
const localeData: any = require('./app/locales/data.json');
const store = configureStore(
  hashHistory,
  window.__INITIAL_STATE__,
);
// const history = syncHistoryWithStore(hashHistory, store);
const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const navKey = 'language';
const navKey2 = 'languages';
const language = (navigator[navKey2] && navigator[navKey2][0]) ||
navigator[navKey] || 'en';

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

// if (!window.hasOwnProperty('intl')) {
//   const key = 'ensure';
//   require[key]([
//     'intl',
//     'intl/locale-data/jsonp/en.js',
//   ], (require) => {
//     require('intl');
//     require('intl/locale-data/jsonp/en.js');
//     ReactDOM.render(
//       <Provider store={store} key="provider">
//         <IntlProvider locale={language} messages={messages}>
//           <Router
//             history={hashHistory}
//             render={connectedCmp}
//           >
//             {routes}
//           </Router>
//         </IntlProvider>
//       </Provider>,
//       document.getElementById('app'),
//     );
//   });
// } else {
  ReactDOM.render(
    <Provider store={store} key="provider">
      <IntlProvider locale={language} messages={messages}>
        <Router
          history={hashHistory}
          render={connectedCmp}
        >
          {routes}
        </Router>
      </IntlProvider>
    </Provider>,
    document.getElementById('app'),
  );
// }
