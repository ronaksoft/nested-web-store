import {IUser} from 'api/interfaces';

export interface IAppStore {
  isLogin: boolean;
  user: IUser | null;
  scrollPositions: any;
}

export interface IAppAction {
  type: string;
  payload?: any;
}
