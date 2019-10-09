import { Component, Vue, Inject } from 'vue-property-decorator';

import { IQuotesProp } from '@/shared/model/quotes-prop.model';
import QuotesPropService from './quotes-prop.service';

@Component
export default class QuotesPropDetails extends Vue {
  @Inject('quotesService') private quotesService: () => QuotesPropService;
  public quotes: IQuotesProp = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.quotesId) {
        vm.retrieveQuotesProp(to.params.quotesId);
      }
    });
  }

  public retrieveQuotesProp(quotesId) {
    this.quotesService()
      .find(quotesId)
      .then(res => {
        this.quotes = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
