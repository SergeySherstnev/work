import axios from 'axios';

import buildPaginationQueryOpts from '@/shared/sort/sorts';

import { ICommentProp } from '@/shared/model/comment-prop.model';

const baseApiUrl = 'api/comments';
const baseSearchApiUrl = 'api/_search/comments?query=';

export default class CommentPropService {
  public search(query, paginationQuery): Promise<any> {
    return new Promise<any>(resolve => {
      axios.get(`${baseSearchApiUrl}${query}&${buildPaginationQueryOpts(paginationQuery)}`).then(function(res) {
        resolve(res);
      });
    });
  }

  public find(id: number): Promise<ICommentProp> {
    return new Promise<ICommentProp>(resolve => {
      axios.get(`${baseApiUrl}/${id}`).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public retrieve(paginationQuery?: any, proposalId = 0, eager = false): Promise<any> {
    return new Promise<any>(resolve => {
      let requestString = baseApiUrl + `?${buildPaginationQueryOpts(paginationQuery)}`;
      if (proposalId > 0) { requestString += '&proposalId=' + proposalId; }
      if (eager) { requestString += '&eagerload=true'; }
      console.log('retrieve requestString: ' + requestString);
      axios.get(requestString).then(function(res) {
        resolve(res);
      });
    });
  }

  public delete(id: number): Promise<any> {
    return new Promise<any>(resolve => {
      axios.delete(`${baseApiUrl}/${id}`).then(function(res) {
        resolve(res);
      });
    });
  }

  public create(entity: ICommentProp): Promise<ICommentProp> {
    return new Promise<ICommentProp>(resolve => {
      axios.post(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public update(entity: ICommentProp): Promise<ICommentProp> {
    return new Promise<ICommentProp>(resolve => {
      axios.put(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }
}
