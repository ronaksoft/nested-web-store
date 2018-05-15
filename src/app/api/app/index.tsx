import axios from 'axios';
import {IApplication} from '../interfaces';
import Const from '../consts/CServer';

class AppFactory {
  public create(app: IApplication) {
    return axios.post(Const.SERVER_URL + '/admin/app/create', app).then((response) => {
      return response.data.data;
    });
  }

  public edit(app: IApplication) {
    return axios.post(Const.SERVER_URL + '/admin/app/edit', app).then((response) => {
      return response.data.data;
    });
  }

  public remove(id: string): Promise<IApplication> {
    return axios.post(Const.SERVER_URL + '/admin/app/remove', {id}).then((response) => {
      return response.data.data;
    });
  }

  public star(id: string): Promise<IApplication> {
    return axios.post(Const.SERVER_URL + '/admin/app/star', {id}).then((response) => {
      return response.data.data;
    });
  }

  public getAll(type: string): Promise<IApplication[]> {
    return axios.post(Const.SERVER_URL + '/app/' + type, {}).then((response) => {
      return response.data.data.apps;
    });
  }

  public get(appId: string): Promise<IApplication> {
    return axios.post(Const.SERVER_URL + '/app/' + appId, {}).then((response) => {
      return response.data.data;
    });
  }

  public getById(id: string): Promise<IApplication> {
    return axios.post(Const.SERVER_URL + '/admin/app/' + id, {}).then((response) => {
      return response.data.data;
    });
  }

  public search(query: string, skip: number = 0, limit: number = 20): Promise<any> {
    return axios.post(Const.SERVER_URL + '/app/search', {query, skip, limit}).then((response) => {
      return response.data.data;
    });
  }

  public searchAll(query: string, status: number = 0, skip: number = 0, limit: number = 20): Promise<any> {
    return axios.post(Const.SERVER_URL + '/admin/app/search',
      {query, status, skip, limit}).then((response) => {
      return response.data.data;
    });
  }
}

export default AppFactory;
