import axios from 'axios';

import buildPaginationQueryOpts from '@/shared/sort/sorts';

import { IHistoryProp } from '@/shared/model/history-prop.model';

const baseApiUrl = 'api/histories';
const baseSearchApiUrl = 'api/_search/histories?query=';

export default class HistoryPropService {
  public search(query, paginationQuery): Promise<any> {
    return new Promise<any>(resolve => {
      axios.get(`${baseSearchApiUrl}${query}&${buildPaginationQueryOpts(paginationQuery)}`).then(function(res) {
        resolve(res);
      });
    });
  }

  public find(id: number): Promise<IHistoryProp> {
    return new Promise<IHistoryProp>(resolve => {
      axios.get(`${baseApiUrl}/${id}`).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public retrieve(paginationQuery?: any): Promise<any> {
    return new Promise<any>(resolve => {
      axios.get(baseApiUrl + `?${buildPaginationQueryOpts(paginationQuery)}`).then(function(res) {
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

  public create(entity: IHistoryProp): Promise<IHistoryProp> {
    return new Promise<IHistoryProp>(resolve => {
      axios.post(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public update(entity: IHistoryProp): Promise<IHistoryProp> {
    return new Promise<IHistoryProp>(resolve => {
      axios.put(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }
}
