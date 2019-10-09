import { Component, Vue, Inject } from 'vue-property-decorator';

import { numeric, required, minLength, maxLength } from 'vuelidate/lib/validators';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { DATE_TIME_LONG_FORMAT, INSTANT_FORMAT, ZONED_DATE_TIME_FORMAT } from '@/shared/date/filters';

import UserService from '@/admin/user-management/user-management.service';

import ProposalPropService from '../proposal-prop/proposal-prop.service';
import { IProposalProp } from '@/shared/model/proposal-prop.model';

import AlertService from '@/shared/alert/alert.service';
import { IHistoryProp, HistoryProp } from '@/shared/model/history-prop.model';
import HistoryPropService from './history-prop.service';

const validations: any = {
  history: {
    createdDate: {
      required
    },
    status: {
      required
    },
    comment: {
      required,
      maxLength: maxLength(10000)
    },
    executive: {
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
export default class HistoryPropUpdate extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('historyService') private historyService: () => HistoryPropService;
  public history: IHistoryProp = new HistoryProp();

  @Inject('userService') private userService: () => UserService;

  public users: Array<any> = [];

  @Inject('proposalService') private proposalService: () => ProposalPropService;

  public proposals: IProposalProp[] = [];
  public isSaving = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.historyId) {
        vm.retrieveHistoryProp(to.params.historyId);
      }
      vm.initRelationships();
    });
  }

  public save(): void {
    this.isSaving = true;
    if (this.history.id) {
      this.historyService()
        .update(this.history)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.history.updated', { param: param.id });
          this.alertService().showAlert(message, 'info');
        });
    } else {
      this.historyService()
        .create(this.history)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.history.created', { param: param.id });
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
      this.history[field] = parse(event.target.value, DATE_TIME_LONG_FORMAT, new Date());
    } else {
      this.history[field] = null;
    }
  }

  public updateZonedDateTimeField(field, event) {
    if (event.target.value) {
      this.history[field] = parse(event.target.value, DATE_TIME_LONG_FORMAT, new Date());
    } else {
      this.history[field] = null;
    }
  }

  public retrieveHistoryProp(historyId): void {
    this.historyService()
      .find(historyId)
      .then(res => {
        this.history = res;
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
