import axios from 'axios';

import buildPaginationQueryOpts from '@/shared/sort/sorts';

import { IProposalProp } from '@/shared/model/proposal-prop.model';
import { ProposalProp } from '@/shared/model/proposal-prop.model';
import { ICommentProp } from '@/shared/model/comment-prop.model';
import { CommentProp } from '@/shared/model/comment-prop.model';
import {IHistoryProp} from '@/shared/model/history-prop.model';

const baseApiUrl = 'api/proposals';
const baseSearchApiUrl = 'api/_search/proposals?query=';

export default class ProposalPropService {

  public addHistory(id: number, history: IHistoryProp): Promise<IHistoryProp> {
    return new Promise<IHistoryProp>(resolve => {
      const requestString = `${baseApiUrl}/${id}/addHistory`;
      console.log('Add history to proposal : ' + id);
      axios.post(requestString, history).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public toggleLike(id: number): Promise<any> {
    return new Promise<any>(resolve => {
      const requestString = `${baseApiUrl}/${id}/togglelike`;
      console.log('Toggle like for proposal : ' + id);
      axios.put(requestString).then(function(res) {
        resolve(res);
      });
    });
  }

  public addComment(id: number, comment: string): Promise<ICommentProp> {
    return new Promise<any>(resolve => {
      const entity = new CommentProp(null, comment, null, null,
        new ProposalProp(id));
      const requestString = `${baseApiUrl}/${id}/addComment`;
      console.log('Add comment for proposal : ' + id);
      axios.post(requestString, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public getHistory(id: number): Promise<any> {
    return new Promise<any>(resolve => {
      const requestString = `${baseApiUrl}/${id}/histories`;
      console.log('Getting histories for Proposal: ' + requestString);
      axios.get(requestString).then(function(res) {
        resolve(res);
      });
    });
  }

  public search(query, paginationQuery, eager = false): Promise<any> {
    return new Promise<any>(resolve => {
      let requestString = `${baseSearchApiUrl}${query}&${buildPaginationQueryOpts(paginationQuery)}`;
      if (eager) { requestString += '&eagerload=true'; }
      console.log('Search requestString: ' + requestString);
      axios.get(requestString).then(function(res) {
        resolve(res);
      });
    });
  }

  public find(id: number): Promise<IProposalProp> {
    return new Promise<IProposalProp>(resolve => {
      axios.get(`${baseApiUrl}/${id}`).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public retrieve(paginationQuery?: any, eager = false): Promise<any> {
    return new Promise<any>(resolve => {
      let requestString = baseApiUrl + `?${buildPaginationQueryOpts(paginationQuery)}`;
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

  public create(entity: IProposalProp): Promise<IProposalProp> {
    return new Promise<IProposalProp>(resolve => {
      axios.post(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public update(entity: IProposalProp): Promise<IProposalProp> {
    return new Promise<IProposalProp>(resolve => {
      axios.put(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }
}
