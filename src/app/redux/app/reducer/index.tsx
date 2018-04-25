import * as Immutable from 'seamless-immutable';
import {IAppAction} from '../IAppStore';
import * as ActionTypes from '../actions/types';

/** Initial Places State */
const initialState = Immutable.from<IAppAction>({
  isLogin: false,
  user: null,
  scrollPositions: {},
});

export default function appReducer(state = initialState, action?: IAppAction) {
  switch (action.type) {
    case ActionTypes.APP_LOGIN:
      return Immutable.merge(state, {
        isLogin: true,
        user: action.payload,
      });

    case ActionTypes.APP_LOGOUT:
      return Immutable.merge(state, {
        isLogin: false,
        user: null,
      });

    case ActionTypes.APP_SCROLL_POSITION_SET:
      return Immutable.merge(state, {
        scrollPositions: Immutable.merge(state.scrollPositions, action.payload),
      });

    case ActionTypes.APP_SCROLL_POSITION_UNSET:
      return Immutable.merge(state, {
        scrollPositions: {},
      });

    default :
      return state;

  }
}
