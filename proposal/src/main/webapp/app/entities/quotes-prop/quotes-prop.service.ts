import axios from 'axios';

import buildPaginationQueryOpts from '@/shared/sort/sorts';

import { IQuotesProp } from '@/shared/model/quotes-prop.model';

const baseApiUrl = 'api/quotes';
const baseSearchApiUrl = 'api/_search/quotes?query=';

export default class QuotesPropService {
  public findRandom(): Promise<IQuotesProp> {
    return new Promise<IQuotesProp>(resolve => {
      axios.get(`${baseApiUrl}/random`).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public search(query, paginationQuery): Promise<any> {
    return new Promise<any>(resolve => {
      axios.get(`${baseSearchApiUrl}${query}&${buildPaginationQueryOpts(paginationQuery)}`).then(function(res) {
        resolve(res);
      });
    });
  }

  public find(id: number): Promise<IQuotesProp> {
    return new Promise<IQuotesProp>(resolve => {
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

  public create(entity: IQuotesProp): Promise<IQuotesProp> {
    return new Promise<IQuotesProp>(resolve => {
      axios.post(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public update(entity: IQuotesProp): Promise<IQuotesProp> {
    return new Promise<IQuotesProp>(resolve => {
      axios.put(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }
}
