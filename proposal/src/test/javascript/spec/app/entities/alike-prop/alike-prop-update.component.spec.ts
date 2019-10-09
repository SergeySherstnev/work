/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import AlikePropUpdateComponent from '@/entities/alike-prop/alike-prop-update.vue';
import AlikePropClass from '@/entities/alike-prop/alike-prop-update.component';
import AlikePropService from '@/entities/alike-prop/alike-prop.service';

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
  describe('AlikeProp Management Update Component', () => {
    let wrapper: Wrapper<AlikePropClass>;
    let comp: AlikePropClass;
    let alikeServiceStub: SinonStubbedInstance<AlikePropService>;

    beforeEach(() => {
      alikeServiceStub = sinon.createStubInstance<AlikePropService>(AlikePropService);

      wrapper = shallowMount<AlikePropClass>(AlikePropUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          alertService: () => new AlertService(store),
          alikeService: () => alikeServiceStub,

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
        comp.alike = entity;
        alikeServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(alikeServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.alike = entity;
        alikeServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(alikeServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });
  });
});
