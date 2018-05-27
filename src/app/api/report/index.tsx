import callApi from '../common';
// import {IReport} from 'api/interfaces';

class ReportFactory {

  public getAll(appId: string, skip: number = 0, limit: number = 20): Promise<any> {
    return callApi('/reviews/' + appId, {skip, limit});
  }
}

export default ReportFactory;
