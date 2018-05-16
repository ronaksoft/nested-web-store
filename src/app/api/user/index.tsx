import axios from 'axios';
import Const from '../consts/CServer';
import {IUser} from 'api/interfaces';

class UserFactory {
  public get(id: string): Promise<any> {
    return axios.post(Const.SERVER_URL + '/admin/user/get/' + id, {}).then((response) => {
      return response.data.data.user;
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

  public getAll(query: string, status: number = 0, skip: number = 0, limit: number = 20): Promise<any> {
    return axios.post(Const.SERVER_URL + '/admin/user/search',
      {query, status, skip, limit}).then((response) => {
      return response.data.data;
    });
  }
}

export default UserFactory;
