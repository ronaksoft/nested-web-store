import callApi from '../common';
import {IReport} from 'api/interfaces';

class ReportFactory {

  public create(model: IReport): Promise<any> {
    return callApi('/report/create', model);
  }

  public adminSearch(query: string, skip: number = 0, limit: number = 20): Promise<any> {
    return callApi('/admin/report/search', {query, skip, limit});
  }

  public setStatus(id: string, status: number): Promise<any> {
    return callApi('/admin/report/setstatus', {id, status});
  }
}

export default ReportFactory;
