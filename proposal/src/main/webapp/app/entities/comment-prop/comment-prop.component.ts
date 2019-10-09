import { Component, Inject, Vue } from 'vue-property-decorator';
import { ICommentProp } from '@/shared/model/comment-prop.model';
import AlertService from '@/shared/alert/alert.service';

import CommentPropService from './comment-prop.service';

@Component
export default class CommentProp extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('commentService') private commentService: () => CommentPropService;
  public currentSearch = '';
  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage: number = null;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;
  public comments: ICommentProp[] = [];

  public isFetching = false;
  public dismissCountDown: number = this.$store.getters.dismissCountDown;
  public dismissSecs: number = this.$store.getters.dismissSecs;
  public alertType: string = this.$store.getters.alertType;
  public alertMessage: any = this.$store.getters.alertMessage;

  public getAlertFromStore() {
    this.dismissCountDown = this.$store.getters.dismissCountDown;
    this.dismissSecs = this.$store.getters.dismissSecs;
    this.alertType = this.$store.getters.alertType;
    this.alertMessage = this.$store.getters.alertMessage;
  }

  public countDownChanged(dismissCountDown: number) {
    this.alertService().countDownChanged(dismissCountDown);
    this.getAlertFromStore();
  }

  public mounted(): void {
    this.retrieveAllCommentProps();
  }

  public search(query): void {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.retrieveAllCommentProps();
  }

  public clear(): void {
    this.currentSearch = '';
    this.page = 1;
    this.retrieveAllCommentProps();
  }

  public retrieveAllCommentProps(): void {
    this.isFetching = true;

    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort()
    };
    if (this.currentSearch) {
      this.commentService()
        .search(this.currentSearch, paginationQuery)
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
      return;
    }
    this.commentService()
      .retrieve(paginationQuery)
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

  public prepareRemove(instance: ICommentProp): void {
    this.removeId = instance.id;
  }

  public removeCommentProp(): void {
    this.commentService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('proposalApp.comment.deleted', { param: this.removeId });
        this.alertService().showAlert(message, 'danger');
        this.getAlertFromStore();

        this.removeId = null;
        this.retrieveAllCommentProps();
        this.closeDialog();
      });
  }

  public sort(): Array<any> {
    const result = [this.propOrder + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.propOrder !== 'id') {
      result.push('id');
    }
    return result;
  }

  public loadPage(page: number): void {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  public transition(): void {
    this.retrieveAllCommentProps();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}
