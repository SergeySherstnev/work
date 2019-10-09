import { Component, Vue, Inject } from 'vue-property-decorator';

import { ICommentProp } from '@/shared/model/comment-prop.model';
import CommentPropService from './comment-prop.service';

@Component
export default class CommentPropDetails extends Vue {
  @Inject('commentService') private commentService: () => CommentPropService;
  public comment: ICommentProp = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.commentId) {
        vm.retrieveCommentProp(to.params.commentId);
      }
    });
  }

  public retrieveCommentProp(commentId) {
    this.commentService()
      .find(commentId)
      .then(res => {
        this.comment = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
