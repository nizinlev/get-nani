import { Person } from './../models/person.model';


export class SetPerson {
    static readonly type = '[Person] SetPerson';
    constructor(public readonly payload: Person) {}
  }
  
  export class SetEmptyPerson {
    static readonly type = '[Person] SetEmptyUser';
    constructor() {}
  }