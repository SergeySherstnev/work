/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import CommentPropDetailComponent from '@/entities/comment-prop/comment-prop-details.vue';
import CommentPropClass from '@/entities/comment-prop/comment-prop-details.component';
import CommentPropService from '@/entities/comment-prop/comment-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('CommentProp Management Detail Component', () => {
    let wrapper: Wrapper<CommentPropClass>;
    let comp: CommentPropClass;
    let commentServiceStub: SinonStubbedInstance<CommentPropService>;

    beforeEach(() => {
      commentServiceStub = sinon.createStubInstance<CommentPropService>(CommentPropService);

      wrapper = shallowMount<CommentPropClass>(CommentPropDetailComponent, {
        store,
        i18n,
        localVue,
        provide: { commentService: () => commentServiceStub }
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundCommentProp = { id: 123 };
        commentServiceStub.find.resolves(foundCommentProp);

        // WHEN
        comp.retrieveCommentProp(123);
        await comp.$nextTick();

        // THEN
        expect(comp.comment).toBe(foundCommentProp);
      });
    });
  });
});
