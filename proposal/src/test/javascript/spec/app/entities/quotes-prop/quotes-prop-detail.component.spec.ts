/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import QuotesPropDetailComponent from '@/entities/quotes-prop/quotes-prop-details.vue';
import QuotesPropClass from '@/entities/quotes-prop/quotes-prop-details.component';
import QuotesPropService from '@/entities/quotes-prop/quotes-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('QuotesProp Management Detail Component', () => {
    let wrapper: Wrapper<QuotesPropClass>;
    let comp: QuotesPropClass;
    let quotesServiceStub: SinonStubbedInstance<QuotesPropService>;

    beforeEach(() => {
      quotesServiceStub = sinon.createStubInstance<QuotesPropService>(QuotesPropService);

      wrapper = shallowMount<QuotesPropClass>(QuotesPropDetailComponent, {
        store,
        i18n,
        localVue,
        provide: { quotesService: () => quotesServiceStub }
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundQuotesProp = { id: 123 };
        quotesServiceStub.find.resolves(foundQuotesProp);

        // WHEN
        comp.retrieveQuotesProp(123);
        await comp.$nextTick();

        // THEN
        expect(comp.quotes).toBe(foundQuotesProp);
      });
    });
  });
});
