/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import ProposalPropDetailComponent from '@/entities/proposal-prop/proposal-prop-details.vue';
import ProposalPropClass from '@/entities/proposal-prop/proposal-prop-details.component';
import ProposalPropService from '@/entities/proposal-prop/proposal-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('ProposalProp Management Detail Component', () => {
    let wrapper: Wrapper<ProposalPropClass>;
    let comp: ProposalPropClass;
    let proposalServiceStub: SinonStubbedInstance<ProposalPropService>;

    beforeEach(() => {
      proposalServiceStub = sinon.createStubInstance<ProposalPropService>(ProposalPropService);

      wrapper = shallowMount<ProposalPropClass>(ProposalPropDetailComponent, {
        store,
        i18n,
        localVue,
        provide: { proposalService: () => proposalServiceStub }
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundProposalProp = { id: 123 };
        proposalServiceStub.find.resolves(foundProposalProp);

        // WHEN
        comp.retrieveProposalProp(123);
        await comp.$nextTick();

        // THEN
        expect(comp.proposal).toBe(foundProposalProp);
      });
    });
  });
});
