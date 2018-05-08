import axios from 'axios';
import {IApp} from '../interfaces';
import Const from '../consts/CServer';

class AppFactory {

  public createApp(app: IApp) {
    return axios.post(Const.SERVER_URL + '/admin/add', app, {
      headers: '',
    }).then((response) => {
      return response.data;
    });
  }
}

export default AppFactory;
