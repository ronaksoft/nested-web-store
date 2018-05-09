import axios from 'axios';
import {ICategory} from '../interfaces';
import Const from '../consts/CServer';

class CategoryFactory {
  public createCategory(category: ICategory) {
    return axios.post(Const.SERVER_URL + '/admin/category/add', category, {
      headers: '',
    }).then((response) => {
      return response.data.data;
    });
  }

  public editCategory(category: ICategory) {
    return axios.post(Const.SERVER_URL + '/admin/category/edit', category, {
      headers: '',
    }).then((response) => {
      return response.data.data;
    });
  }

  public getCategories(): Promise<ICategory[]> {
    return axios.post(Const.SERVER_URL + '/category/get', {}, {
      headers: '',
    }).then((response) => {
      return response.data.data.categories;
    });
  }
}

export default CategoryFactory;
