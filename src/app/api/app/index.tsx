import callApi from '../common';
import {IApplication} from '../interfaces';

class AppFactory {
  public create(app: IApplication) {
    return callApi('/admin/app/create', app);
  }

  public edit(app: IApplication) {
    return callApi('/admin/app/edit', app);
  }

  public remove(id: string): Promise<IApplication> {
    return callApi('/admin/app/remove', {id});
  }

  public star(id: string): Promise<IApplication> {
    return callApi('/admin/app/star', {id});
  }

  public appIdAvailable(appId: string): Promise<boolean> {
    return callApi('/admin/app/available', {query: appId});
  }

  public getAll(type: string): Promise<IApplication[]> {
    return callApi('/app/' + type, {}).then((response) => {
      return response.apps;
    });
  }

  public get(appId: string): Promise<IApplication> {
    return callApi('/app/' + appId, {});
  }

  public getById(id: string): Promise<IApplication> {
    return callApi('/admin/app/' + id, {});
  }

  public search(query: string, skip: number = 0, limit: number = 20): Promise<any> {
    return callApi('/app/search', {query, skip, limit});
  }

  public searchAll(query: string, status: number = 0, skip: number = 0, limit: number = 20): Promise<any> {
    return callApi('/admin/app/search', {query, status, skip, limit});
  }
}

export default AppFactory;
