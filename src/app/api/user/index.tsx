import callApi from '../common';
import {IUser} from 'api/interfaces';

class UserFactory {
  public get(id: string): Promise<any> {
    return callApi('/admin/user/get/' + id, {});
  }

  public remove(id: string): Promise<string> {
    return callApi('/admin/user/remove', {id});
  }

  public create(model: IUser): Promise<IUser> {
    return callApi('/admin/user/create', model);
  }

  public edit(model: IUser) {
    return callApi('/admin/user/edit', model);
  }

  public getAll(query: string, status: number = 0, skip: number = 0, limit: number = 20): Promise<any> {
    return callApi('/admin/user/search', {query, status, skip, limit});
  }

  public getCurrent(): Promise<any> {
    return callApi('/user/current', {});
  }
}

export default UserFactory;
