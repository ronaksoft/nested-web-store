import axios from 'axios';
import {IPermission} from '../interfaces';
import Const from '../consts/CServer';

class CategoryFactory {
  public create(category: IPermission) {
    return axios.post(Const.SERVER_URL + '/admin/permission/create', category).then((response) => {
      return response.data.data;
    });
  }

  public edit(category: IPermission) {
    return axios.post(Const.SERVER_URL + '/admin/permission/edit', category).then((response) => {
      return response.data.data;
    });
  }

  public remove(id: string) {
    return axios.post(Const.SERVER_URL + '/admin/permission/remove', {
      id,
    }).then((response) => {
      return response.data.data;
    });
  }

  public getAll(): Promise<IPermission[]> {
    return axios.post(Const.SERVER_URL + '/admin/permission/get', {}).then((response) => {
      return response.data.data.permissions;
    });
  }
}

export default CategoryFactory;
