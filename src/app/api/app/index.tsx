import axios from 'axios';
import {IApplication} from '../interfaces';
import Const from '../consts/CServer';

class AppFactory {
  public create(app: IApplication) {
    return axios.post(Const.SERVER_URL + '/admin/app/add', app).then((response) => {
      return response.data.data;
    });
  }

  public getAll(type: string): Promise<IApplication[]> {
    return axios.post(Const.SERVER_URL + '/app/' + type, {}).then((response) => {
      return response.data.data.apps;
    });
  }

  public get(appId: string): Promise<IApplication> {
    return axios.post(Const.SERVER_URL + '/app/' + appId, {}).then((response) => {
      return response.data.data.app;
    });
  }

  public remove(appId: string): Promise<IApplication> {
    return axios.post(Const.SERVER_URL + '/admin/app/remove/', {appId}).then((response) => {
      return response.data.data.app;
    });
  }

  public search(query: string, skip: number = 0, limit: number = 20): Promise<IApplication[]> {
    return axios.post(Const.SERVER_URL + '/app/search/', {query, skip, limit}).then((response) => {
      return response.data.data.apps;
    });
  }
}

export default AppFactory;
