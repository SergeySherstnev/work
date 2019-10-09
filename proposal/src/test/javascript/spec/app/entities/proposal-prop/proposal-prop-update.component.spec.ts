/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import ProposalPropUpdateComponent from '@/entities/proposal-prop/proposal-prop-update.vue';
import ProposalPropClass from '@/entities/proposal-prop/proposal-prop-update.component';
import ProposalPropService from '@/entities/proposal-prop/proposal-prop.service';

import AlikePropService from '@/entities/alike-prop/alike-prop.service';

import HistoryPropService from '@/entities/history-prop/history-prop.service';

import CommentPropService from '@/entities/comment-prop/comment-prop.service';

import UserService from '@/admin/user-management/user-management.service';

import TagPropService from '@/entities/tag-prop/tag-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.component('font-awesome-icon', {});

describe('Component Tests', () => {
  describe('ProposalProp Management Update Component', () => {
    let wrapper: Wrapper<ProposalPropClass>;
    let comp: ProposalPropClass;
    let proposalServiceStub: SinonStubbedInstance<ProposalPropService>;

    beforeEach(() => {
      proposalServiceStub = sinon.createStubInstance<ProposalPropService>(ProposalPropService);

      wrapper = shallowMount<ProposalPropClass>(ProposalPropUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          alertService: () => new AlertService(store),
          proposalService: () => proposalServiceStub,

          alikeService: () => new AlikePropService(),

          historyService: () => new HistoryPropService(),

          commentService: () => new CommentPropService(),

          userService: () => new UserService(),

          tagService: () => new TagPropService()
        }
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.proposal = entity;
        proposalServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(proposalServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.proposal = entity;
        proposalServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(proposalServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });
  });
});
