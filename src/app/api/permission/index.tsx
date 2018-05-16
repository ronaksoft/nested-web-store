import callApi from '../common';
import {IPermission} from '../interfaces';

class CategoryFactory {
  public create(category: IPermission) {
    return callApi('/admin/permission/create', category);
  }

  public edit(category: IPermission) {
    return callApi('/admin/permission/edit', category);
  }

  public remove(id: string) {
    return callApi('/admin/permission/remove', {id});
  }

  public getAll(): Promise<IPermission[]> {
    return callApi('/admin/permission/get', {}).then((response) => {
      return response.permissions;
    });
  }
}

export default CategoryFactory;
