import callApi from '../common';
import {ICategory} from '../interfaces';

class CategoryFactory {
  public create(category: ICategory) {
    return callApi('/admin/category/create', category);
  }

  public edit(category: ICategory) {
    return callApi('/admin/category/edit', category);
  }

  public remove(id: string) {
    return callApi('/admin/category/remove', {id});
  }

  public setOrder(categories: ICategory[]) {
    return callApi('/admin/category/setorder', categories);
  }

  public getAll(): Promise<ICategory[]> {
    return callApi('/category/get', {}).then((response) => {
      return response.categories;
    });
  }
}

export default CategoryFactory;
