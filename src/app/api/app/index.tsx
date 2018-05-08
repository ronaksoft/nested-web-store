import axios from 'axios';
import {IApplication} from '../interfaces';
import Const from '../consts/CServer';

class AppFactory {

  public createApp(app: IApplication) {
    return axios.post(Const.SERVER_URL + '/admin/app/add', app, {
      headers: '',
    }).then((response) => {
      return response.data;
    });
  }
}

export default AppFactory;
