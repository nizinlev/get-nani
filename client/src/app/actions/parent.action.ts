import { Parent } from './../models/parent.model';

export class SetParent {
    static readonly type = '[SetParent] SetParent';
    constructor(public readonly payload: Parent) {}
  }
  
  export class SetEmptyParent {
    static readonly type = '[Parent] SetEmptyParent';
    constructor() {}
  }