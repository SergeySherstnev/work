import { Component, Vue, Inject } from 'vue-property-decorator';

import { IProposalProp } from '@/shared/model/proposal-prop.model';

import AlertService from '@/shared/alert/alert.service';
import AccountService from '@/account/account.service';
import ProposalPropService from '@/entities/proposal-prop/proposal-prop.service';

@Component
export default class Proposal extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('proposalService') private proposalService: () => ProposalPropService;
  @Inject('accountService') private accountService: () => AccountService;

  public page = 1;
  public itemsPerPage = 5;
  public previousPage: number = null;
  public totalItems = 0;
  public queryCount: number = null;
  public isFetching = false;

  public currentSearch = '';

  public propOrder = 'id';
  public reverse = true;

  public proposals: IProposalProp[] = [];

  public dismissCountDown: number = this.$store.getters.dismissCountDown;
  public dismissSecs: number = this.$store.getters.dismissSecs;
  public alertType: string = this.$store.getters.alertType;
  public alertMessage: any = this.$store.getters.alertMessage;
  public likeSubmitting = false;

  public hasAnyAuthority(authorities: any): boolean {
    return this.accountService().hasAnyAuthority(authorities);
  }

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
    this.scroll();
  }

  public scroll() {
    window.onscroll = () => {
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
      console.log('bottomOfWindow=' + bottomOfWindow);

      if (bottomOfWindow) {
        console.log('this.isFetching=' + this.isFetching);
        console.log('this.page=' + this.page);
        console.log('this.itemsPerPage=' + this.itemsPerPage);
        console.log('this.totalItems=' + this.totalItems);
        if (!this.isFetching && this.page * this.itemsPerPage < this.totalItems) {
          this.page++;
          this.retrieveAllProposalProps(true);
        }
      }
    };
  }

  public search(query): void {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.page = 1;
    this.retrieveAllProposalProps();
  }

  public clear(): void {
    this.currentSearch = '';
    this.page = 1;
    this.retrieveAllProposalProps();
  }

  public retrieveAllProposalProps(concat = false): void {
    console.log('retrieveAllProposalProps. concat=' + concat);
    this.isFetching = true;

    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort()
    };
    if (this.currentSearch) {
      this.proposalService()
        .search(this.currentSearch, paginationQuery, true)
        .then(
          res => {
            if (concat) {
              this.proposals = this.proposals.concat(res.data);
            } else {
              this.proposals = res.data;
            }

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
      .retrieve(paginationQuery, true)
      .then(
        res => {
          if (concat) {
            this.proposals = this.proposals.concat(res.data);
          } else {
            this.proposals = res.data;
          }
          this.totalItems = Number(res.headers['x-total-count']);
          this.queryCount = this.totalItems;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
        }
      );
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
    if (this.propOrder === propOrder) {
      this.reverse = !this.reverse;
    }
    this.propOrder = propOrder;
  }

  public toggleLike(proposal: IProposalProp) {
    this.likeSubmitting = true;
    this.proposalService()
      .toggleLike(proposal.id)
      .then(res => {
        proposal.liked = res.data > 0;
        proposal.alikeSum = proposal.alikeSum + res.data;
        this.likeSubmitting = false;
      })
      .catch(err => {
        this.alertService().showAlert(err, 'danger');
        this.likeSubmitting = false;
      });
  }
}
