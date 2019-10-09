import { IProposalProp } from '@/shared/model/proposal-prop.model';

export interface ITagProp {
  id?: number;
  name?: string;
  proposals?: IProposalProp[];
}

export class TagProp implements ITagProp {
  constructor(public id?: number, public name?: string, public proposals?: IProposalProp[]) {}
}
