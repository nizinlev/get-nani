import { Nani } from "../models/nani.model";


export class SetType {
    static readonly type = '[SetType] SetType';
    constructor(public readonly payload: Nani) {}
  }
  
  export class SetEmptyType {
    static readonly type = '[Nani] SetEmptyType';
    constructor() {}
  }