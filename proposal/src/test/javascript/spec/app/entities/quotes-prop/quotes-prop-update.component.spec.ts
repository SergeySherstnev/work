/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import QuotesPropUpdateComponent from '@/entities/quotes-prop/quotes-prop-update.vue';
import QuotesPropClass from '@/entities/quotes-prop/quotes-prop-update.component';
import QuotesPropService from '@/entities/quotes-prop/quotes-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.component('font-awesome-icon', {});

describe('Component Tests', () => {
  describe('QuotesProp Management Update Component', () => {
    let wrapper: Wrapper<QuotesPropClass>;
    let comp: QuotesPropClass;
    let quotesServiceStub: SinonStubbedInstance<QuotesPropService>;

    beforeEach(() => {
      quotesServiceStub = sinon.createStubInstance<QuotesPropService>(QuotesPropService);

      wrapper = shallowMount<QuotesPropClass>(QuotesPropUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          alertService: () => new AlertService(store),
          quotesService: () => quotesServiceStub
        }
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.quotes = entity;
        quotesServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(quotesServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.quotes = entity;
        quotesServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(quotesServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });
  });
});
