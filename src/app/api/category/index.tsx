import axios from 'axios';
import {ICategory} from '../interfaces';
import Const from '../consts/CServer';

class CategoryFactory {

  public createApp(category: ICategory) {
    return axios.post(Const.SERVER_URL + '/admin/category/add', category, {
      headers: '',
    }).then((response) => {
      return response.data;
    });
  }
}

export default CategoryFactory;
