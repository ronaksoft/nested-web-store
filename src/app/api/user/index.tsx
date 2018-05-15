import axios from 'axios';
import Const from '../consts/CServer';
import {IUser} from 'api/interfaces';

class UserFactory {

  public getAll(type: string): Promise<IUser[]> {
    return axios.post(Const.SERVER_URL + '/admin/user/' + type, {}).then((response) => {
      return response.data.data.apps;
    });
  }

  public remove(id: string): Promise<string> {
    return axios.post(Const.SERVER_URL + '/admin/user/remove', {id}).then((response) => {
      return response.data.data;
    });
  }

  public create(model: IUser): Promise<IUser> {
    return axios.post(Const.SERVER_URL + '/admin/user/create', model).then((response) => {
      return response.data.data;
    });
  }

  public edit(model: IUser) {
    return axios.post(Const.SERVER_URL + '/admin/user/edit', model).then((response) => {
      return response.data.data;
    });
  }
}

export default UserFactory;
