import axios from 'axios';
import {IApp} from '../interfaces';

const server = 'http://localhost:8080';

class AppFactory {

  public createApp(app: IApp) {
    return axios.post(server + '/admin/add', app, {
      headers: '',
    }).then((response) => {
      return response.data;
    });
  }
}

export default AppFactory;
