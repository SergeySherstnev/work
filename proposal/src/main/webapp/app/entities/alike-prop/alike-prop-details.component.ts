import { Component, Vue, Inject } from 'vue-property-decorator';

import { IAlikeProp } from '@/shared/model/alike-prop.model';
import AlikePropService from './alike-prop.service';

@Component
export default class AlikePropDetails extends Vue {
  @Inject('alikeService') private alikeService: () => AlikePropService;
  public alike: IAlikeProp = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.alikeId) {
        vm.retrieveAlikeProp(to.params.alikeId);
      }
    });
  }

  public retrieveAlikeProp(alikeId) {
    this.alikeService()
      .find(alikeId)
      .then(res => {
        this.alike = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
