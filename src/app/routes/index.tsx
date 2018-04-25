import * as React from 'react';
import {
  Main,
} from 'scenes';
import Container from 'scenes';
import {Provider} from 'react-redux';
import {Router, Route, hashHistory, IndexRoute, Redirect} from 'react-router';
import {configureStore} from 'redux/store';

const store = configureStore(hashHistory);

export default (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route component={Container}>
        <IndexRoute component={Main}/>
        <Redirect from="/" to="/feed" />
        {/* <Route path="/message/:postId" component={Post}/> */}
      </Route>
      <Redirect from="*" to="/404"/>
    </Router>
  </Provider>
);
