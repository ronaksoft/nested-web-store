import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {IStore} from './IStore';
import appReducer from './app/reducer/index';

const {reducer} = require('redux-connect');

const rootReducer: Redux.Reducer<IStore> = combineReducers<IStore>({
  routing: routerReducer,
  app : appReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
