/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import AlikePropDetailComponent from '@/entities/alike-prop/alike-prop-details.vue';
import AlikePropClass from '@/entities/alike-prop/alike-prop-details.component';
import AlikePropService from '@/entities/alike-prop/alike-prop.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('AlikeProp Management Detail Component', () => {
    let wrapper: Wrapper<AlikePropClass>;
    let comp: AlikePropClass;
    let alikeServiceStub: SinonStubbedInstance<AlikePropService>;

    beforeEach(() => {
      alikeServiceStub = sinon.createStubInstance<AlikePropService>(AlikePropService);

      wrapper = shallowMount<AlikePropClass>(AlikePropDetailComponent, {
        store,
        i18n,
        localVue,
        provide: { alikeService: () => alikeServiceStub }
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundAlikeProp = { id: 123 };
        alikeServiceStub.find.resolves(foundAlikeProp);

        // WHEN
        comp.retrieveAlikeProp(123);
        await comp.$nextTick();

        // THEN
        expect(comp.alike).toBe(foundAlikeProp);
      });
    });
  });
});
