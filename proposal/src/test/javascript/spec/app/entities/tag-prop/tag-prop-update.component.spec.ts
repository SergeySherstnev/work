/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import TagPropUpdateComponent from '@/entities/tag-prop/tag-prop-update.vue';
import TagPropClass from '@/entities/tag-prop/tag-prop-update.component';
import TagPropService from '@/entities/tag-prop/tag-prop.service';

import ProposalPropService from '@/entities/proposal-prop/proposal-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.component('font-awesome-icon', {});

describe('Component Tests', () => {
  describe('TagProp Management Update Component', () => {
    let wrapper: Wrapper<TagPropClass>;
    let comp: TagPropClass;
    let tagServiceStub: SinonStubbedInstance<TagPropService>;

    beforeEach(() => {
      tagServiceStub = sinon.createStubInstance<TagPropService>(TagPropService);

      wrapper = shallowMount<TagPropClass>(TagPropUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          alertService: () => new AlertService(store),
          tagService: () => tagServiceStub,

          proposalService: () => new ProposalPropService()
        }
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.tag = entity;
        tagServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(tagServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.tag = entity;
        tagServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(tagServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });
  });
});
