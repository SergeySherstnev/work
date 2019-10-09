import { Component, Vue, Inject } from 'vue-property-decorator';

import { numeric, required, minLength, maxLength } from 'vuelidate/lib/validators';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { DATE_TIME_LONG_FORMAT, INSTANT_FORMAT, ZONED_DATE_TIME_FORMAT } from '@/shared/date/filters';

import UserService from '@/admin/user-management/user-management.service';

import ProposalPropService from '../proposal-prop/proposal-prop.service';
import { IProposalProp } from '@/shared/model/proposal-prop.model';

import AlertService from '@/shared/alert/alert.service';
import { ICommentProp, CommentProp } from '@/shared/model/comment-prop.model';
import CommentPropService from './comment-prop.service';

const validations: any = {
  comment: {
    text: {
      required,
      maxLength: maxLength(10000)
    },
    createdDate: {
      required
    },
    author: {
      required
    },
    proposal: {
      required
    }
  }
};

@Component({
  validations
})
export default class CommentPropUpdate extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('commentService') private commentService: () => CommentPropService;
  public comment: ICommentProp = new CommentProp();

  @Inject('userService') private userService: () => UserService;

  public users: Array<any> = [];

  @Inject('proposalService') private proposalService: () => ProposalPropService;

  public proposals: IProposalProp[] = [];
  public isSaving = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.commentId) {
        vm.retrieveCommentProp(to.params.commentId);
      }
      vm.initRelationships();
    });
  }

  public save(): void {
    this.isSaving = true;
    if (this.comment.id) {
      this.commentService()
        .update(this.comment)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.comment.updated', { param: param.id });
          this.alertService().showAlert(message, 'info');
        });
    } else {
      this.commentService()
        .create(this.comment)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.comment.created', { param: param.id });
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
      this.comment[field] = parse(event.target.value, DATE_TIME_LONG_FORMAT, new Date());
    } else {
      this.comment[field] = null;
    }
  }

  public updateZonedDateTimeField(field, event) {
    if (event.target.value) {
      this.comment[field] = parse(event.target.value, DATE_TIME_LONG_FORMAT, new Date());
    } else {
      this.comment[field] = null;
    }
  }

  public retrieveCommentProp(commentId): void {
    this.commentService()
      .find(commentId)
      .then(res => {
        this.comment = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.userService()
      .retrieve()
      .then(res => {
        this.users = res.data;
      });
    this.proposalService()
      .retrieve()
      .then(res => {
        this.proposals = res.data;
      });
  }
}
