import * as React from 'react';
import AppWrapper, {
  Main, AppView, AdminApp,
} from 'scenes';
import NotFound from 'containers/404';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router';
import {configureStore} from 'redux/store';

const store = configureStore(browserHistory);

export default (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={AppWrapper}>
        <IndexRoute component={Main}/>
        <Route path="/" component={Main}/>
        <Route path="/app/:appid" component={AppView}/>
        <Route path="/admin/app" component={AdminApp}/>
      </Route>
      <Route path="/404" component={NotFound}/>
      <Route path="*" component={NotFound}/>
      <Redirect from="*" to="/404"/>
    </Router>
  </Provider>
);
