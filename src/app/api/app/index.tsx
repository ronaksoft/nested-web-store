import axios from 'axios';
import {IApplication} from '../interfaces';
import Const from '../consts/CServer';

class AppFactory {

  public createApp(app: IApplication) {
    return axios.post(Const.SERVER_URL + '/admin/app/add', app).then((response) => {
      return response.data.data;
    });
  }

  public getApps(type: string): Promise<IApplication[]> {
    return axios.post(Const.SERVER_URL + '/app/' + type, {}).then((response) => {
      return response.data.data.apps;
    });
  }

  public getApp(id: string): Promise<IApplication> {
    return axios.post(Const.SERVER_URL + '/app/' + id, {}).then((response) => {
      return response.data.data.app;
    });
  }
}

export default AppFactory;
