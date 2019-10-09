/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import TagPropComponent from '@/entities/tag-prop/tag-prop.vue';
import TagPropClass from '@/entities/tag-prop/tag-prop.component';
import TagPropService from '@/entities/tag-prop/tag-prop.service';

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
  describe('TagProp Management Component', () => {
    let wrapper: Wrapper<TagPropClass>;
    let comp: TagPropClass;
    let tagServiceStub: SinonStubbedInstance<TagPropService>;

    beforeEach(() => {
      tagServiceStub = sinon.createStubInstance<TagPropService>(TagPropService);
      tagServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<TagPropClass>(TagPropComponent, {
        store,
        i18n,
        localVue,
        stubs: { jhiItemCount: true, bPagination: true, bModal: bModalStub as any },
        provide: {
          alertService: () => new AlertService(store),
          tagService: () => tagServiceStub
        }
      });
      comp = wrapper.vm;
    });

    it('should be a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('Should call load all on init', async () => {
      // GIVEN
      tagServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllTagProps();
      await comp.$nextTick();

      // THEN
      expect(tagServiceStub.retrieve.called).toBeTruthy();
      expect(comp.tags[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should load a page', async () => {
      // GIVEN
      tagServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.loadPage(1);
      await comp.$nextTick();

      // THEN
      expect(tagServiceStub.retrieve.called).toBeTruthy();
      expect(comp.tags[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should not load a page if the page is the same as the previous page', () => {
      // GIVEN
      tagServiceStub.retrieve.reset();
      comp.previousPage = 1;

      // WHEN
      comp.loadPage(1);

      // THEN
      expect(tagServiceStub.retrieve.called).toBeFalsy();
    });

    it('should re-initialize the page', async () => {
      // GIVEN
      tagServiceStub.retrieve.reset();
      tagServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.loadPage(2);
      await comp.$nextTick();
      comp.clear();
      await comp.$nextTick();

      // THEN
      expect(tagServiceStub.retrieve.callCount).toEqual(3);
      expect(comp.page).toEqual(1);
      expect(comp.tags[0]).toEqual(jasmine.objectContaining({ id: 123 }));
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
      tagServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      comp.removeTagProp();
      await comp.$nextTick();

      // THEN
      expect(tagServiceStub.delete.called).toBeTruthy();
      expect(tagServiceStub.retrieve.callCount).toEqual(2);
    });
  });
});
