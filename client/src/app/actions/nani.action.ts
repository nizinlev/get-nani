import { Nani } from "../models/nani.model";


export class SetNani {
    static readonly type = '[SetNani] SetNani';
    constructor(public readonly payload: Nani) {}
  }
  
  export class SetEmptyNani {
    static readonly type = '[Nani] SetEmptyNani';
    constructor() {}
  }