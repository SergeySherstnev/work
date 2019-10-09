/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import AlikePropComponent from '@/entities/alike-prop/alike-prop.vue';
import AlikePropClass from '@/entities/alike-prop/alike-prop.component';
import AlikePropService from '@/entities/alike-prop/alike-prop.service';

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
  describe('AlikeProp Management Component', () => {
    let wrapper: Wrapper<AlikePropClass>;
    let comp: AlikePropClass;
    let alikeServiceStub: SinonStubbedInstance<AlikePropService>;

    beforeEach(() => {
      alikeServiceStub = sinon.createStubInstance<AlikePropService>(AlikePropService);
      alikeServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<AlikePropClass>(AlikePropComponent, {
        store,
        i18n,
        localVue,
        stubs: { jhiItemCount: true, bPagination: true, bModal: bModalStub as any },
        provide: {
          alertService: () => new AlertService(store),
          alikeService: () => alikeServiceStub
        }
      });
      comp = wrapper.vm;
    });

    it('should be a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('Should call load all on init', async () => {
      // GIVEN
      alikeServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllAlikeProps();
      await comp.$nextTick();

      // THEN
      expect(alikeServiceStub.retrieve.called).toBeTruthy();
      expect(comp.alikes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should load a page', async () => {
      // GIVEN
      alikeServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.loadPage(1);
      await comp.$nextTick();

      // THEN
      expect(alikeServiceStub.retrieve.called).toBeTruthy();
      expect(comp.alikes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should not load a page if the page is the same as the previous page', () => {
      // GIVEN
      alikeServiceStub.retrieve.reset();
      comp.previousPage = 1;

      // WHEN
      comp.loadPage(1);

      // THEN
      expect(alikeServiceStub.retrieve.called).toBeFalsy();
    });

    it('should re-initialize the page', async () => {
      // GIVEN
      alikeServiceStub.retrieve.reset();
      alikeServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.loadPage(2);
      await comp.$nextTick();
      comp.clear();
      await comp.$nextTick();

      // THEN
      expect(alikeServiceStub.retrieve.callCount).toEqual(3);
      expect(comp.page).toEqual(1);
      expect(comp.alikes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
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
      alikeServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      comp.removeAlikeProp();
      await comp.$nextTick();

      // THEN
      expect(alikeServiceStub.delete.called).toBeTruthy();
      expect(alikeServiceStub.retrieve.callCount).toEqual(2);
    });
  });
});
