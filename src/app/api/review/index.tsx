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
}

export default ReviewFactory;
