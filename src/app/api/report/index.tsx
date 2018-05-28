import callApi from '../common';
import {IReport} from 'api/interfaces';

class ReportFactory {

  public adminSearch(query: string, skip: number = 0, limit: number = 20): Promise<any> {
    return callApi('/admin/report/search', {query, skip, limit});
  }

  public create(model: IReport): Promise<any> {
    return callApi('/report/create', model);
  }
}

export default ReportFactory;
