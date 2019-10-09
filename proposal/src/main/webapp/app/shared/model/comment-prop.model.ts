import { IUser } from '@/shared/model/user.model';
import { IProposalProp } from '@/shared/model/proposal-prop.model';

export interface ICommentProp {
  id?: number;
  text?: string;
  createdDate?: Date;
  author?: IUser;
  proposal?: IProposalProp;
}

export class CommentProp implements ICommentProp {
  constructor(
    public id?: number,
    public text?: string,
    public createdDate?: Date,
    public author?: IUser,
    public proposal?: IProposalProp
  ) {}
}
