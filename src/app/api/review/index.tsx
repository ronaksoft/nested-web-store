import callApi from '../common';
import {IReview} from 'api/interfaces';

class ReviewFactory {
  public remove(id: string): Promise<string> {
    return callApi('/admin/review/remove', {id});
  }

  public create(appId: string, model: IReview): Promise<IReview> {
    return callApi('/review/create/' + appId, model);
  }

  public edit(model: IReview) {
    return callApi('/review/edit', model);
  }

  public getAll(appId: string, skip: number = 0, limit: number = 20): Promise<any> {
    return callApi('/reviews/' + appId, {skip, limit});
  }

  public adminSearch(query: string, skip: number = 0, limit: number = 20): Promise<any> {
    return callApi('/admin/review/search', {query, skip, limit});
  }

  public setStatus(id: string, status: number): Promise<any> {
    return callApi('/admin/review/setstatus', {id, status});
  }

  public reply(id: string, body: string): Promise<any> {
    return callApi('/admin/review/reply', {id, body});
  }

  public setStatusAll(ids: string[], status: number): Promise<any> {
    return callApi('/admin/review/setstatus/all', {ids, status});
  }

  public removeAll(ids: string[]): Promise<string> {
    return callApi('/admin/review/remove/all', {ids});
  }
}

export default ReviewFactory;
