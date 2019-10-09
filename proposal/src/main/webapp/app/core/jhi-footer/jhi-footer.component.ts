import { Component } from 'vue-property-decorator';
import { Inject, Vue } from 'vue-property-decorator';
import QuotesService from '@/entities/quotes-prop/quotes-prop.service';
import { IQuotesProp } from '@/shared/model/quotes-prop.model';

@Component
export default class JhiFooter extends Vue {
  @Inject('quotesService')
  private quotesService: () => QuotesService;

  private quoteText = 'T-Systems RUS';

  mounted() {
    this.quotesService()
      .findRandom()
      .then(res => {
        this.quoteText = res.text + ' (' + res.author + ')';
        console.log('this.quote = ' + this.quote);
      })
      .catch(error => {
        console.error('Error: ' + error);
      });
  }

  public get quote(): string {
    return this.quoteText;
  }
}
