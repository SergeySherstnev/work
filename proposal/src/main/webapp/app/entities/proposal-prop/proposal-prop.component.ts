import { Component, Inject, Vue } from 'vue-property-decorator';
import { IProposalProp } from '@/shared/model/proposal-prop.model';
import AlertService from '@/shared/alert/alert.service';

import ProposalPropService from './proposal-prop.service';

@Component
export default class ProposalProp extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('proposalService') private proposalService: () => ProposalPropService;
  public currentSearch = '';
  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage: number = null;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;
  public proposals: IProposalProp[] = [];

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
    this.retrieveAllProposalProps();
  }

  public search(query): void {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.retrieveAllProposalProps();
  }

  public clear(): void {
    this.currentSearch = '';
    this.page = 1;
    this.retrieveAllProposalProps();
  }

  public retrieveAllProposalProps(): void {
    this.isFetching = true;

    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort()
    };
    if (this.currentSearch) {
      this.proposalService()
        .search(this.currentSearch, paginationQuery)
        .then(
          res => {
            this.proposals = res.data;
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
    this.proposalService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.proposals = res.data;
          this.totalItems = Number(res.headers['x-total-count']);
          this.queryCount = this.totalItems;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
        }
      );
  }

  public prepareRemove(instance: IProposalProp): void {
    this.removeId = instance.id;
  }

  public removeProposalProp(): void {
    this.proposalService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('proposalApp.proposal.deleted', { param: this.removeId });
        this.alertService().showAlert(message, 'danger');
        this.getAlertFromStore();

        this.removeId = null;
        this.retrieveAllProposalProps();
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
    this.retrieveAllProposalProps();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}
