import { Component, Vue, Inject } from 'vue-property-decorator';

import { numeric, required, minLength, maxLength } from 'vuelidate/lib/validators';

import AlertService from '@/shared/alert/alert.service';
import { IQuotesProp, QuotesProp } from '@/shared/model/quotes-prop.model';
import QuotesPropService from './quotes-prop.service';

const validations: any = {
  quotes: {
    text: {
      required,
      maxLength: maxLength(1000)
    },
    author: {
      required
    },
    category: {
      required
    }
  }
};

@Component({
  validations
})
export default class QuotesPropUpdate extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('quotesService') private quotesService: () => QuotesPropService;
  public quotes: IQuotesProp = new QuotesProp();
  public isSaving = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.quotesId) {
        vm.retrieveQuotesProp(to.params.quotesId);
      }
    });
  }

  public save(): void {
    this.isSaving = true;
    if (this.quotes.id) {
      this.quotesService()
        .update(this.quotes)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.quotes.updated', { param: param.id });
          this.alertService().showAlert(message, 'info');
        });
    } else {
      this.quotesService()
        .create(this.quotes)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('proposalApp.quotes.created', { param: param.id });
          this.alertService().showAlert(message, 'success');
        });
    }
  }

  public retrieveQuotesProp(quotesId): void {
    this.quotesService()
      .find(quotesId)
      .then(res => {
        this.quotes = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {}
}
