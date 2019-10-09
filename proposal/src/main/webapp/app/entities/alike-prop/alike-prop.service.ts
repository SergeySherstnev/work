import axios from 'axios';

import buildPaginationQueryOpts from '@/shared/sort/sorts';

import { IAlikeProp } from '@/shared/model/alike-prop.model';

const baseApiUrl = 'api/alikes';
const baseSearchApiUrl = 'api/_search/alikes?query=';

export default class AlikePropService {
  public search(query, paginationQuery): Promise<any> {
    return new Promise<any>(resolve => {
      axios.get(`${baseSearchApiUrl}${query}&${buildPaginationQueryOpts(paginationQuery)}`).then(function(res) {
        resolve(res);
      });
    });
  }

  public find(id: number): Promise<IAlikeProp> {
    return new Promise<IAlikeProp>(resolve => {
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

  public create(entity: IAlikeProp): Promise<IAlikeProp> {
    return new Promise<IAlikeProp>(resolve => {
      axios.post(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public update(entity: IAlikeProp): Promise<IAlikeProp> {
    return new Promise<IAlikeProp>(resolve => {
      axios.put(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }
}
