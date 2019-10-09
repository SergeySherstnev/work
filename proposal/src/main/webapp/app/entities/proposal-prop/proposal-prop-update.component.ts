import { Component, Vue, Inject } from 'vue-property-decorator';

import { numeric, required, minLength, maxLength } from 'vuelidate/lib/validators';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { DATE_TIME_LONG_FORMAT, INSTANT_FORMAT, ZONED_DATE_TIME_FORMAT } from '@/shared/date/filters';

import AlikePropService from '../alike-prop/alike-prop.service';
import { IAlikeProp } from '@/shared/model/alike-prop.model';

import HistoryPropService from '../history-prop/history-prop.service';
import { IHistoryProp } from '@/shared/model/history-prop.model';

import CommentPropService from '../comment-prop/comment-prop.service';
import { ICommentProp } from '@/shared/model/comment-prop.model';

import UserService from '@/admin/user-management/user-management.service';

import TagPropService from '../tag-prop/tag-prop.service';
import { ITagProp } from '@/shared/model/tag-prop.model';

import AlertService from '@/shared/alert/alert.service';
import { IProposalProp, ProposalProp } from '@/shared/model/proposal-prop.model';
import ProposalPropService from './proposal-prop.service';

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
    createdDate: {
      required
    },
    updatedDate: {
      required
    },
    status: {
      required
    },
    author: {
      required
    }
  }
};

@Component({
  validations
})
export default class ProposalPropUpdate extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('proposalService') private proposalService: () => ProposalPropService;
  public proposal: IProposalProp = new ProposalProp();

  @Inject('alikeService') private alikeService: () => AlikePropService;

  public alikes: IAlikeProp[] = [];

  @Inject('historyService') private historyService: () => HistoryPropService;

  public histories: IHistoryProp[] = [];

  @Inject('commentService') private commentService: () => CommentPropService;

  public comments: ICommentProp[] = [];

  @Inject('userService') private userService: () => UserService;

  public users: Array<any> = [];

  @Inject('tagService') private tagService: () => TagPropService;

  public tags: ITagProp[] = [];
  public isSaving = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.proposalId) {
        vm.retrieveProposalProp(to.params.proposalId);
      }
      vm.initRelationships();
    });
  }

  created(): void {
    this.proposal.tags = [];
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

  public convertDateTimeFromServer(date: Date): string {
    if (date) {
      return format(date, DATE_TIME_LONG_FORMAT);
    }
    return null;
  }

  public updateInstantField(field, event) {
    if (event.target.value) {
      this.proposal[field] = parse(event.target.value, DATE_TIME_LONG_FORMAT, new Date());
    } else {
      this.proposal[field] = null;
    }
  }

  public updateZonedDateTimeField(field, event) {
    if (event.target.value) {
      this.proposal[field] = parse(event.target.value, DATE_TIME_LONG_FORMAT, new Date());
    } else {
      this.proposal[field] = null;
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
    this.alikeService()
      .retrieve()
      .then(res => {
        this.alikes = res.data;
      });
    this.historyService()
      .retrieve()
      .then(res => {
        this.histories = res.data;
      });
    this.commentService()
      .retrieve()
      .then(res => {
        this.comments = res.data;
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
