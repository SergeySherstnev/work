import { Component, Vue, Inject } from 'vue-property-decorator';

import { IProposalProp } from '@/shared/model/proposal-prop.model';
import ProposalPropService from './proposal-prop.service';

@Component
export default class ProposalPropDetails extends Vue {
  @Inject('proposalService') private proposalService: () => ProposalPropService;
  public proposal: IProposalProp = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.proposalId) {
        vm.retrieveProposalProp(to.params.proposalId);
      }
    });
  }

  public retrieveProposalProp(proposalId) {
    this.proposalService()
      .find(proposalId)
      .then(res => {
        this.proposal = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
