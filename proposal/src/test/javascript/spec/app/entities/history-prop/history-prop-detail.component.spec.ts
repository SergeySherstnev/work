/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import HistoryPropDetailComponent from '@/entities/history-prop/history-prop-details.vue';
import HistoryPropClass from '@/entities/history-prop/history-prop-details.component';
import HistoryPropService from '@/entities/history-prop/history-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('HistoryProp Management Detail Component', () => {
    let wrapper: Wrapper<HistoryPropClass>;
    let comp: HistoryPropClass;
    let historyServiceStub: SinonStubbedInstance<HistoryPropService>;

    beforeEach(() => {
      historyServiceStub = sinon.createStubInstance<HistoryPropService>(HistoryPropService);

      wrapper = shallowMount<HistoryPropClass>(HistoryPropDetailComponent, {
        store,
        i18n,
        localVue,
        provide: { historyService: () => historyServiceStub }
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundHistoryProp = { id: 123 };
        historyServiceStub.find.resolves(foundHistoryProp);

        // WHEN
        comp.retrieveHistoryProp(123);
        await comp.$nextTick();

        // THEN
        expect(comp.history).toBe(foundHistoryProp);
      });
    });
  });
});
