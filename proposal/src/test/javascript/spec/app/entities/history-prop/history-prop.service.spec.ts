/* tslint:disable max-line-length */
import axios from 'axios';
import { format } from 'date-fns';

import * as config from '@/shared/config/config';
import { DATE_TIME_FORMAT } from '@/shared/date/filters';
import HistoryPropService from '@/entities/history-prop/history-prop.service';
import { HistoryProp } from '@/shared/model/history-prop.model';
import { Status } from '@/shared/model/status-prop.model';

const mockedAxios: any = axios;
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

describe('Service Tests', () => {
  describe('HistoryProp Service', () => {
    let service: HistoryPropService;
    let elemDefault;
    let currentDate: Date;
    beforeEach(() => {
      service = new HistoryPropService();
      currentDate = new Date();

      elemDefault = new HistoryProp(0, currentDate, Status.NEW, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', async () => {
        const returnedFromService = Object.assign(
          {
            createdDate: format(currentDate, DATE_TIME_FORMAT)
          },
          elemDefault
        );
        mockedAxios.get.mockReturnValue(Promise.resolve({ data: returnedFromService }));

        return service.find(123).then(res => {
          expect(res).toMatchObject(elemDefault);
        });
      });

      it('should create a HistoryProp', async () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdDate: format(currentDate, DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            createdDate: currentDate
          },
          returnedFromService
        );

        mockedAxios.post.mockReturnValue(Promise.resolve({ data: returnedFromService }));
        return service.create({}).then(res => {
          expect(res).toMatchObject(expected);
        });
      });

      it('should update a HistoryProp', async () => {
        const returnedFromService = Object.assign(
          {
            createdDate: format(currentDate, DATE_TIME_FORMAT),
            status: 'BBBBBB',
            comment: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdDate: currentDate
          },
          returnedFromService
        );
        mockedAxios.put.mockReturnValue(Promise.resolve({ data: returnedFromService }));

        return service.update(expected).then(res => {
          expect(res).toMatchObject(expected);
        });
      });

      it('should return a list of HistoryProp', async () => {
        const returnedFromService = Object.assign(
          {
            createdDate: format(currentDate, DATE_TIME_FORMAT),
            status: 'BBBBBB',
            comment: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            createdDate: currentDate
          },
          returnedFromService
        );
        mockedAxios.get.mockReturnValue(Promise.resolve([returnedFromService]));
        return service.retrieve({ sort: {}, page: 0, size: 10 }).then(res => {
          expect(res).toContainEqual(expected);
        });
      });

      it('should delete a HistoryProp', async () => {
        mockedAxios.delete.mockReturnValue(Promise.resolve({ ok: true }));
        return service.delete(123).then(res => {
          expect(res.ok).toBeTruthy();
        });
      });
    });
  });
});
