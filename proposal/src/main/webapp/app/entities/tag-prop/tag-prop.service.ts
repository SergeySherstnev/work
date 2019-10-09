import axios from 'axios';

import buildPaginationQueryOpts from '@/shared/sort/sorts';

import { ITagProp } from '@/shared/model/tag-prop.model';

const baseApiUrl = 'api/tags';
const baseSearchApiUrl = 'api/_search/tags?query=';

export default class TagPropService {
  public search(query, paginationQuery): Promise<any> {
    return new Promise<any>(resolve => {
      axios.get(`${baseSearchApiUrl}${query}&${buildPaginationQueryOpts(paginationQuery)}`).then(function(res) {
        resolve(res);
      });
    });
  }

  public find(id: number): Promise<ITagProp> {
    return new Promise<ITagProp>(resolve => {
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

  public create(entity: ITagProp): Promise<ITagProp> {
    return new Promise<ITagProp>(resolve => {
      axios.post(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public update(entity: ITagProp): Promise<ITagProp> {
    return new Promise<ITagProp>(resolve => {
      axios.put(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }
}
