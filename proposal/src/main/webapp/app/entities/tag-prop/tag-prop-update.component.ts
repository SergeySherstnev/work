import { Component, Vue, Inject } from 'vue-property-decorator';

import { numeric, required, minLength, maxLength } from 'vuelidate/lib/validators';

import ProposalPropService from '../proposal-prop/proposal-prop.service';
import { IProposalProp } from '@/shared/model/proposal-prop.model';

import AlertService from '@/shared/alert/alert.service';
import { ITagProp, TagProp } from '@/shared/model/tag-prop.model';
import TagPropService from './tag-prop.service';

const validations: any = {
  tag: {
    name: {
      required,
      maxLength: maxLength(50)
    }
  }
};

@Component({
  validations
})
export default class TagPropUpdate extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('tagService') private tagService: () => TagPropService;
  public tag: ITagProp = new TagProp();

  @Inject('proposalService') private proposalService: () => ProposalPropService;

  public proposals: IProposalProp[] = [];
  public isSaving = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.tagId) {
        vm.retrieveTagProp(to.params.tagId);
      }
      vm.initRelationships();
    });
  }

  public save(): void {
    this.isSaving = true;
    if (this.tag.id) {
      this.tagService()
        .update(this.tag)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.tag.updated', { param: param.id });
          this.alertService().showAlert(message, 'info');
        });
    } else {
      this.tagService()
        .create(this.tag)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.tag.created', { param: param.id });
          this.alertService().showAlert(message, 'success');
        });
    }
  }

  public retrieveTagProp(tagId): void {
    this.tagService()
      .find(tagId)
      .then(res => {
        this.tag = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.proposalService()
      .retrieve()
      .then(res => {
        this.proposals = res.data;
      });
  }
}
