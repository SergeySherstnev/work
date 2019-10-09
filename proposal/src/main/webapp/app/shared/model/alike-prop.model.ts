import { IUser } from '@/shared/model/user.model';
import { IProposalProp } from '@/shared/model/proposal-prop.model';

export interface IAlikeProp {
  id?: number;
  text?: string;
  createdDate?: Date;
  author?: IUser;
  proposal?: IProposalProp;
}

export class AlikeProp implements IAlikeProp {
  constructor(
    public id?: number,
    public text?: string,
    public createdDate?: Date,
    public author?: IUser,
    public proposal?: IProposalProp
  ) {}
}
