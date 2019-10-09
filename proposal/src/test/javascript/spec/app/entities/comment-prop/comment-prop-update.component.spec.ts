/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import CommentPropUpdateComponent from '@/entities/comment-prop/comment-prop-update.vue';
import CommentPropClass from '@/entities/comment-prop/comment-prop-update.component';
import CommentPropService from '@/entities/comment-prop/comment-prop.service';

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
  describe('CommentProp Management Update Component', () => {
    let wrapper: Wrapper<CommentPropClass>;
    let comp: CommentPropClass;
    let commentServiceStub: SinonStubbedInstance<CommentPropService>;

    beforeEach(() => {
      commentServiceStub = sinon.createStubInstance<CommentPropService>(CommentPropService);

      wrapper = shallowMount<CommentPropClass>(CommentPropUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          alertService: () => new AlertService(store),
          commentService: () => commentServiceStub,

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
        comp.comment = entity;
        commentServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(commentServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.comment = entity;
        commentServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(commentServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });
  });
});
