import { Component, Vue, Inject } from 'vue-property-decorator';

import { numeric, required, minLength, maxLength } from 'vuelidate/lib/validators';

import HistoryPropService from '@/entities/history-prop/history-prop.service';
import { IHistoryProp } from '@/shared/model/history-prop.model';

import UserService from '@/admin/user-management/user-management.service';

import TagPropService from '@/entities/tag-prop/tag-prop.service';
import { ITagProp } from '@/shared/model/tag-prop.model';

import AlertService from '@/shared/alert/alert.service';
import { IProposalProp, ProposalProp } from '@/shared/model/proposal-prop.model';
import ProposalPropService from '@/entities/proposal-prop/proposal-prop.service';
import TagInput from '../shared/elements/tag-input.vue';

import { VueEditor } from 'vue2-editor';
Vue.component('vue-editor', VueEditor);

const validations: any = {
  proposal: {
    caption: {
      required
    },
    description: {
      required,
      maxLength: maxLength(10000)
    },
    priority: {
      numeric
    },
    alikeSum: {},
    commentSum: {},
    author: {
      required
    }
  }
};

@Component({
  components: {
    taginput: TagInput
  },
  validations
})
export default class ProposalPropUpdate extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('proposalService') private proposalService: () => ProposalPropService;
  public proposal: IProposalProp = new ProposalProp();

  @Inject('historyService') private historyService: () => HistoryPropService;

  public histories: IHistoryProp[] = [];

  @Inject('userService') private userService: () => UserService;

  public users: Array<any> = [];

  @Inject('tagService') private tagService: () => TagPropService;

  public tags: ITagProp[] = [];
  public isSaving = false;

  public customToolbar: Array<any> = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ color: [] }, { background: [] }],
    ['link'],
    ['clean']
  ];

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.proposalId) {
        vm.retrieveProposalProp(to.params.proposalId);
      }
      vm.initRelationships();
    });
  }

  public get user(): any {
    return this.$store.getters.account;
  }

  created(): void {
    this.proposal.tags = [];
    this.proposal.author = this.user;
  }

  public save(): void {
    this.isSaving = true;
    if (this.proposal.id) {
      this.proposalService()
        .update(this.proposal)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.proposal.updated', { param: param.id });
          this.alertService().showAlert(message, 'info');
        });
    } else {
      this.proposalService()
        .create(this.proposal)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.proposal.created', { param: param.id });
          this.alertService().showAlert(message, 'success');
        });
    }
  }

  public retrieveProposalProp(proposalId): void {
    this.proposalService()
      .find(proposalId)
      .then(res => {
        this.proposal = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.historyService()
      .retrieve()
      .then(res => {
        this.histories = res.data;
      });
    this.userService()
      .retrieve()
      .then(res => {
        this.users = res.data;
      });
    this.tagService()
      .retrieve()
      .then(res => {
        this.tags = res.data;
      });
  }

  public getSelected(selectedVals, option): any {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
