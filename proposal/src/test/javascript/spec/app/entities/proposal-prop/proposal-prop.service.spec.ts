/* tslint:disable max-line-length */
import axios from 'axios';
import { format } from 'date-fns';

import * as config from '@/shared/config/config';
import { DATE_TIME_FORMAT } from '@/shared/date/filters';
import ProposalPropService from '@/entities/proposal-prop/proposal-prop.service';
import { ProposalProp } from '@/shared/model/proposal-prop.model';
import { Status } from '@/shared/model/status-prop.model';

const mockedAxios: any = axios;
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

describe('Service Tests', () => {
  describe('ProposalProp Service', () => {
    let service: ProposalPropService;
    let elemDefault;
    let currentDate: Date;
    beforeEach(() => {
      service = new ProposalPropService();
      currentDate = new Date();

      elemDefault = new ProposalProp(0, 'AAAAAAA', 'AAAAAAA', 0, 0, 0, currentDate, currentDate, Status.NEW);
    });

    describe('Service methods', () => {
      it('should find an element', async () => {
        const returnedFromService = Object.assign(
          {
            createdDate: format(currentDate, DATE_TIME_FORMAT),
            updatedDate: format(currentDate, DATE_TIME_FORMAT)
          },
          elemDefault
        );
        mockedAxios.get.mockReturnValue(Promise.resolve({ data: returnedFromService }));

        return service.find(123).then(res => {
          expect(res).toMatchObject(elemDefault);
        });
      });

      it('should create a ProposalProp', async () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdDate: format(currentDate, DATE_TIME_FORMAT),
            updatedDate: format(currentDate, DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            createdDate: currentDate,
            updatedDate: currentDate
          },
          returnedFromService
        );

        mockedAxios.post.mockReturnValue(Promise.resolve({ data: returnedFromService }));
        return service.create({}).then(res => {
          expect(res).toMatchObject(expected);
        });
      });

      it('should update a ProposalProp', async () => {
        const returnedFromService = Object.assign(
          {
            caption: 'BBBBBB',
            description: 'BBBBBB',
            priority: 1,
            alikeSum: 1,
            commentSum: 1,
            createdDate: format(currentDate, DATE_TIME_FORMAT),
            updatedDate: format(currentDate, DATE_TIME_FORMAT),
            status: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdDate: currentDate,
            updatedDate: currentDate
          },
          returnedFromService
        );
        mockedAxios.put.mockReturnValue(Promise.resolve({ data: returnedFromService }));

        return service.update(expected).then(res => {
          expect(res).toMatchObject(expected);
        });
      });

      it('should return a list of ProposalProp', async () => {
        const returnedFromService = Object.assign(
          {
            caption: 'BBBBBB',
            description: 'BBBBBB',
            priority: 1,
            alikeSum: 1,
            commentSum: 1,
            createdDate: format(currentDate, DATE_TIME_FORMAT),
            updatedDate: format(currentDate, DATE_TIME_FORMAT),
            status: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            createdDate: currentDate,
            updatedDate: currentDate
          },
          returnedFromService
        );
        mockedAxios.get.mockReturnValue(Promise.resolve([returnedFromService]));
        return service.retrieve({ sort: {}, page: 0, size: 10 }).then(res => {
          expect(res).toContainEqual(expected);
        });
      });

      it('should delete a ProposalProp', async () => {
        mockedAxios.delete.mockReturnValue(Promise.resolve({ ok: true }));
        return service.delete(123).then(res => {
          expect(res.ok).toBeTruthy();
        });
      });
    });
  });
});
