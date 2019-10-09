export interface IQuotesProp {
  id?: number;
  text?: string;
  author?: string;
  category?: string;
}

export class QuotesProp implements IQuotesProp {
  constructor(public id?: number, public text?: string, public author?: string, public category?: string) {}
}
