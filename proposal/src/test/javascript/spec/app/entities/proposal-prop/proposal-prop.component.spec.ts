/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import ProposalPropComponent from '@/entities/proposal-prop/proposal-prop.vue';
import ProposalPropClass from '@/entities/proposal-prop/proposal-prop.component';
import ProposalPropService from '@/entities/proposal-prop/proposal-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('b-alert', {});
localVue.component('b-badge', {});
localVue.directive('b-modal', {});
localVue.component('b-button', {});
localVue.component('router-link', {});

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {}
  }
};

describe('Component Tests', () => {
  describe('ProposalProp Management Component', () => {
    let wrapper: Wrapper<ProposalPropClass>;
    let comp: ProposalPropClass;
    let proposalServiceStub: SinonStubbedInstance<ProposalPropService>;

    beforeEach(() => {
      proposalServiceStub = sinon.createStubInstance<ProposalPropService>(ProposalPropService);
      proposalServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<ProposalPropClass>(ProposalPropComponent, {
        store,
        i18n,
        localVue,
        stubs: { jhiItemCount: true, bPagination: true, bModal: bModalStub as any },
        provide: {
          alertService: () => new AlertService(store),
          proposalService: () => proposalServiceStub
        }
      });
      comp = wrapper.vm;
    });

    it('should be a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('Should call load all on init', async () => {
      // GIVEN
      proposalServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllProposalProps();
      await comp.$nextTick();

      // THEN
      expect(proposalServiceStub.retrieve.called).toBeTruthy();
      expect(comp.proposals[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should load a page', async () => {
      // GIVEN
      proposalServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.loadPage(1);
      await comp.$nextTick();

      // THEN
      expect(proposalServiceStub.retrieve.called).toBeTruthy();
      expect(comp.proposals[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should not load a page if the page is the same as the previous page', () => {
      // GIVEN
      proposalServiceStub.retrieve.reset();
      comp.previousPage = 1;

      // WHEN
      comp.loadPage(1);

      // THEN
      expect(proposalServiceStub.retrieve.called).toBeFalsy();
    });

    it('should re-initialize the page', async () => {
      // GIVEN
      proposalServiceStub.retrieve.reset();
      proposalServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.loadPage(2);
      await comp.$nextTick();
      comp.clear();
      await comp.$nextTick();

      // THEN
      expect(proposalServiceStub.retrieve.callCount).toEqual(3);
      expect(comp.page).toEqual(1);
      expect(comp.proposals[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should calculate the sort attribute for an id', () => {
      // WHEN
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['id,desc']);
    });

    it('should calculate the sort attribute for a non-id attribute', () => {
      // GIVEN
      comp.propOrder = 'name';

      // WHEN
      const result = comp.sort();

      // THEN
      expect(result).toEqual(['name,desc', 'id']);
    });

    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      proposalServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      comp.removeProposalProp();
      await comp.$nextTick();

      // THEN
      expect(proposalServiceStub.delete.called).toBeTruthy();
      expect(proposalServiceStub.retrieve.callCount).toEqual(2);
    });
  });
});
