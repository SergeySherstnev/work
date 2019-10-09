import { Component, Vue, Inject } from 'vue-property-decorator';

import { ITagProp } from '@/shared/model/tag-prop.model';
import TagPropService from './tag-prop.service';

@Component
export default class TagPropDetails extends Vue {
  @Inject('tagService') private tagService: () => TagPropService;
  public tag: ITagProp = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.tagId) {
        vm.retrieveTagProp(to.params.tagId);
      }
    });
  }

  public retrieveTagProp(tagId) {
    this.tagService()
      .find(tagId)
      .then(res => {
        this.tag = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
