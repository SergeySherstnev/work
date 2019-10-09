import { IAlikeProp } from '@/shared/model/alike-prop.model';
import { IHistoryProp } from '@/shared/model/history-prop.model';
import { ICommentProp } from '@/shared/model/comment-prop.model';
import { IUser } from '@/shared/model/user.model';
import { ITagProp } from '@/shared/model/tag-prop.model';
import { Status } from '@/shared/model/status-prop.model';

export interface IProposalProp {
  id?: number;
  caption?: string;
  description?: string;
  priority?: number;
  alikeSum?: number;
  commentSum?: number;
  createdDate?: Date;
  updatedDate?: Date;
  status?: Status;
  alikes?: IAlikeProp[];
  histories?: IHistoryProp[];
  comments?: ICommentProp[];
  author?: IUser;
  tags?: ITagProp[];
  liked?: boolean;
}

export class ProposalProp implements IProposalProp {
  constructor(
    public id?: number,
    public caption?: string,
    public description?: string,
    public priority?: number,
    public alikeSum?: number,
    public commentSum?: number,
    public createdDate?: Date,
    public updatedDate?: Date,
    public status?: Status,
    public alikes?: IAlikeProp[],
    public histories?: IHistoryProp[],
    public comments?: ICommentProp[],
    public author?: IUser,
    public tags?: ITagProp[],
    public liked?: boolean
  ) {}
}
