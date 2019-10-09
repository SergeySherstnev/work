/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import TagPropDetailComponent from '@/entities/tag-prop/tag-prop-details.vue';
import TagPropClass from '@/entities/tag-prop/tag-prop-details.component';
import TagPropService from '@/entities/tag-prop/tag-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('TagProp Management Detail Component', () => {
    let wrapper: Wrapper<TagPropClass>;
    let comp: TagPropClass;
    let tagServiceStub: SinonStubbedInstance<TagPropService>;

    beforeEach(() => {
      tagServiceStub = sinon.createStubInstance<TagPropService>(TagPropService);

      wrapper = shallowMount<TagPropClass>(TagPropDetailComponent, {
        store,
        i18n,
        localVue,
        provide: { tagService: () => tagServiceStub }
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundTagProp = { id: 123 };
        tagServiceStub.find.resolves(foundTagProp);

        // WHEN
        comp.retrieveTagProp(123);
        await comp.$nextTick();

        // THEN
        expect(comp.tag).toBe(foundTagProp);
      });
    });
  });
});
