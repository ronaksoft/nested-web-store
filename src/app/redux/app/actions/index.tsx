import {} from '../IAppStore';
import * as ActionTypes from './types';
import {IUser} from 'api/interfaces';
import {IAppAction} from '../IAppStore';

export function userSet(user: IUser): IAppAction {
  return {
    type: ActionTypes.APP_USER_SET,
    payload: user,
  };
}

export function userUpdate(user: IUser): IAppAction {
  return {
    type: ActionTypes.APP_USER_UPDATE,
    payload: user,
  };
}

export function userUnset(): IAppAction {
  return {
    type: ActionTypes.APP_USER_UNSET,
  };
}

export function setLang(language: string): IAppAction {
  return {
    type: ActionTypes.APP_SET_LANGUAGE,
    payload: language,
  };
}

export function login(user: IUser): IAppAction {
  return {
    type: ActionTypes.APP_LOGIN,
    payload: user,
  };
}

export function logout(): IAppAction {
  return {
    type: ActionTypes.APP_LOGOUT,
  };
}

export function setScroll(payload: any): IAppAction {
  return {
    type: ActionTypes.APP_SCROLL_POSITION_SET,
    payload,
  };
}

export function unsetScroll(): IAppAction {
  return {
    type: ActionTypes.APP_SCROLL_POSITION_UNSET,
  };
}
