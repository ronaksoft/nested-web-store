import axios from 'axios';
import {ICategory} from '../interfaces';
import Const from '../consts/CServer';

class CategoryFactory {
  public createCategory(category: ICategory) {
    return axios.post(Const.SERVER_URL + '/admin/category/add', category).then((response) => {
      return response.data.data;
    });
  }

  public editCategory(category: ICategory) {
    return axios.post(Const.SERVER_URL + '/admin/category/edit', category).then((response) => {
      return response.data.data;
    });
  }

  public removeCategory(id: string) {
    return axios.post(Const.SERVER_URL + '/admin/category/remove', {
      id,
    }).then((response) => {
      return response.data.data;
    });
  }

  public setCategoriesOrder(categories: ICategory[]) {
    return axios.post(Const.SERVER_URL + '/admin/category/setorder', categories).then((response) => {
      return response.data.data;
    });
  }

  public getCategories(): Promise<ICategory[]> {
    return axios.post(Const.SERVER_URL + '/category/get', {}).then((response) => {
      return response.data.data.categories;
    });
  }
}

export default CategoryFactory;
