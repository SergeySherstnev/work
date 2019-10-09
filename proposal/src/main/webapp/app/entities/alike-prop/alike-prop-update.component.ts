import { Component, Vue, Inject } from 'vue-property-decorator';

import { numeric, required, minLength, maxLength } from 'vuelidate/lib/validators';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { DATE_TIME_LONG_FORMAT, INSTANT_FORMAT, ZONED_DATE_TIME_FORMAT } from '@/shared/date/filters';

import UserService from '@/admin/user-management/user-management.service';

import ProposalPropService from '../proposal-prop/proposal-prop.service';
import { IProposalProp } from '@/shared/model/proposal-prop.model';

import AlertService from '@/shared/alert/alert.service';
import { IAlikeProp, AlikeProp } from '@/shared/model/alike-prop.model';
import AlikePropService from './alike-prop.service';

const validations: any = {
  alike: {
    text: {
      maxLength: maxLength(10)
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
export default class AlikePropUpdate extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('alikeService') private alikeService: () => AlikePropService;
  public alike: IAlikeProp = new AlikeProp();

  @Inject('userService') private userService: () => UserService;

  public users: Array<any> = [];

  @Inject('proposalService') private proposalService: () => ProposalPropService;

  public proposals: IProposalProp[] = [];
  public isSaving = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.alikeId) {
        vm.retrieveAlikeProp(to.params.alikeId);
      }
      vm.initRelationships();
    });
  }

  public save(): void {
    this.isSaving = true;
    if (this.alike.id) {
      this.alikeService()
        .update(this.alike)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.alike.updated', { param: param.id });
          this.alertService().showAlert(message, 'info');
        });
    } else {
      this.alikeService()
        .create(this.alike)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.alike.created', { param: param.id });
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
      this.alike[field] = parse(event.target.value, DATE_TIME_LONG_FORMAT, new Date());
    } else {
      this.alike[field] = null;
    }
  }

  public updateZonedDateTimeField(field, event) {
    if (event.target.value) {
      this.alike[field] = parse(event.target.value, DATE_TIME_LONG_FORMAT, new Date());
    } else {
      this.alike[field] = null;
    }
  }

  public retrieveAlikeProp(alikeId): void {
    this.alikeService()
      .find(alikeId)
      .then(res => {
        this.alike = res;
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
