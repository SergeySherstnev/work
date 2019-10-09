/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import HistoryPropUpdateComponent from '@/entities/history-prop/history-prop-update.vue';
import HistoryPropClass from '@/entities/history-prop/history-prop-update.component';
import HistoryPropService from '@/entities/history-prop/history-prop.service';

import UserService from '@/admin/user-management/user-management.service';

import ProposalPropService from '@/entities/proposal-prop/proposal-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.component('font-awesome-icon', {});

describe('Component Tests', () => {
  describe('HistoryProp Management Update Component', () => {
    let wrapper: Wrapper<HistoryPropClass>;
    let comp: HistoryPropClass;
    let historyServiceStub: SinonStubbedInstance<HistoryPropService>;

    beforeEach(() => {
      historyServiceStub = sinon.createStubInstance<HistoryPropService>(HistoryPropService);

      wrapper = shallowMount<HistoryPropClass>(HistoryPropUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          alertService: () => new AlertService(store),
          historyService: () => historyServiceStub,

          userService: () => new UserService(),

          proposalService: () => new ProposalPropService()
        }
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.history = entity;
        historyServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(historyServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.history = entity;
        historyServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(historyServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });
  });
});
