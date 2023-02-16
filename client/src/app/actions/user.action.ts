import { User } from './../models/user.model';

export class SetCurrentUser {
  static readonly type = '[User] SetUser';
  constructor(public payload: User) {}
}

export class SetEmptyUser {
  static readonly type = '[User] SetEmptyUser';
  constructor() {}
}
