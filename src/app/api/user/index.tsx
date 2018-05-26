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

  public getAll(query: string, statuses: number[] = [], skip: number = 0, limit: number = 20): Promise<any> {
    return callApi('/admin/user/search', {query, statuses, skip, limit});
  }

  public getCurrent(): Promise<any> {
    return callApi('/user/current', {});
  }

  public logout(): Promise<any> {
    return callApi('/user/logout', {});
  }
}

export default UserFactory;
