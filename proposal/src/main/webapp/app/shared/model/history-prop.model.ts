import { IUser } from '@/shared/model/user.model';
import { IProposalProp } from '@/shared/model/proposal-prop.model';
import { Status } from '@/shared/model/status-prop.model';

export interface IHistoryProp {
  id?: number;
  createdDate?: Date;
  status?: Status;
  comment?: string;
  executive?: IUser;
  assignee?: IUser;
  proposal?: IProposalProp;
}

export class HistoryProp implements IHistoryProp {
  constructor(
    public id?: number,
    public createdDate?: Date,
    public status?: Status,
    public comment?: string,
    public executive?: IUser,
    public assignee?: IUser,
    public proposal?: IProposalProp
  ) {}
}
