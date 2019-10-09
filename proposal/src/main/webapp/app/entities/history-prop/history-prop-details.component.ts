import { Component, Vue, Inject } from 'vue-property-decorator';

import { IHistoryProp } from '@/shared/model/history-prop.model';
import HistoryPropService from './history-prop.service';

@Component
export default class HistoryPropDetails extends Vue {
  @Inject('historyService') private historyService: () => HistoryPropService;
  public history: IHistoryProp = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.historyId) {
        vm.retrieveHistoryProp(to.params.historyId);
      }
    });
  }

  public retrieveHistoryProp(historyId) {
    this.historyService()
      .find(historyId)
      .then(res => {
        this.history = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
