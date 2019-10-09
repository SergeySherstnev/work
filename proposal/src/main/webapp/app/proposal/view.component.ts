import { Component, Vue, Inject } from 'vue-property-decorator';

import { IProposalProp } from '@/shared/model/proposal-prop.model';
import { ICommentProp } from '@/shared/model/comment-prop.model';
import { HistoryProp, IHistoryProp } from '@/shared/model/history-prop.model';

import ProposalPropService from '@/entities/proposal-prop/proposal-prop.service';
import CommentPropService from '@/entities/comment-prop/comment-prop.service';
import AlertService from '@/shared/alert/alert.service';
import AccountService from '@/account/account.service';
import UserService from '@/admin/user-management/user-management.service';

@Component
export default class ProposalDetails extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('proposalService') private proposalService: () => ProposalPropService;
  @Inject('commentService') private commentService: () => CommentPropService;
  @Inject('accountService') private accountService: () => AccountService;
  @Inject('userService') private userService: () => UserService;

  public proposal: IProposalProp = {};
  public comments: ICommentProp[] = [];
  public histories: IHistoryProp[] = [];
  public managers: Array<any> = [];

  public totalItems = 0;
  public queryCount: number = null;
  public isFetching = false;
  public page = 1;
  public itemsPerPage = 20;
  private removeId: number = null;

  public likeSubmitting = false;

  public currentComment = '';
  public commentSubmitting = false;

  public history: IHistoryProp = new HistoryProp();
  public historySubmitting = false;

  public addHistory(): void {
    this.historySubmitting = true;
    this.history.proposal = this.proposal;
    this.proposalService()
      .addHistory(this.proposal.id, this.history)
      .then(param => {
        this.historySubmitting = false;
        this.histories.push(param);
        this.proposal.status = param.status;
        this.history = new HistoryProp();
        const message = this.$t('proposalApp.history.created', { param: param.id });
        this.alertService().showAlert(message, 'success');
      });
  }

  public get userId(): number {
    return this.$store.getters.account ? this.$store.getters.account.id : -1;
  }

  public hasAnyAuthority(authorities: any): boolean {
    return this.accountService().hasAnyAuthority(authorities);
  }

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.proposalId) {
        vm.retrieveProposalProp(to.params.proposalId);
        vm.retrieveProposalComments(to.params.proposalId);
        vm.retrieveProposalHistories(to.params.proposalId);
        vm.initRelationships();
      }
    });
  }

  public initRelationships(): void {
    this.userService()
      .retrieveManagers()
      .then(res => {
        this.managers = res.data;
      });
  }

  public retrieveProposalHistories(proposalId) {
    this.proposalService()
      .getHistory(proposalId)
      .then(res => {
        this.histories = res.data;
      });
  }

  public retrieveProposalProp(proposalId) {
    this.proposalService()
      .find(proposalId)
      .then(res => {
        this.proposal = res;
      });
  }

  public retrieveProposalComments(proposalId) {
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: ['createdDate,asc']
    };
    this.commentService()
      .retrieve(paginationQuery, proposalId, true)
      .then(
        res => {
          this.comments = res.data;
          this.totalItems = Number(res.headers['x-total-count']);
          this.queryCount = this.totalItems;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
        }
      );
  }

  public previousState() {
    this.$router.go(-1);
  }

  public toggleLike() {
    this.likeSubmitting = true;
    this.proposalService()
      .toggleLike(this.proposal.id)
      .then(res => {
        this.proposal.liked = res.data > 0;
        this.proposal.alikeSum = this.proposal.alikeSum + res.data;
        this.likeSubmitting = false;
      })
      .catch(err => {
        // this.alertService().showAlert(err, 'danger');
        this.likeSubmitting = false;
      });
  }

  public addComment(comment: string) {
    this.commentSubmitting = true;
    this.proposalService()
      .addComment(this.proposal.id, comment)
      .then(param => {
        this.comments.push(param);
        this.proposal.commentSum = this.proposal.commentSum + 1;
        this.commentSubmitting = false;
        this.currentComment = '';
      })
      .catch(err => {
        // this.alertService().showAlert(err, 'danger');
        this.commentSubmitting = false;
      });
  }

  public prepareRemove(instance: IProposalProp): void {
    this.removeId = instance.id;
  }

  public deleteProposal(): void {
    this.proposalService()
      .delete(this.removeId)
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.$router.go(-1);
          const message = this.$t('proposalApp.proposal.deleted', { param: this.removeId });
          this.alertService().showAlert(message, 'success');
        } else {
          this.$router.go(-1);
          const message = this.$t('proposalApp.proposal.error');
          this.alertService().showAlert(message, 'danger');
        }
        this.removeId = null;
      })
      .catch(err => {
        this.alertService().showAlert(err, 'danger');
      });
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}
