import { SetNani, SetEmptyNani } from './../actions/nani.action';
import { SetEmptyParent, SetParent } from './../actions/parent.action';
import { User } from './../models/user.model';
import { SetCurrentUser, SetEmptyUser } from './../actions/user.action';
import { Parent } from './../models/parent.model';
import { Nani } from './../models/nani.model';
import { Person } from '../models/person.model';
import { Action, State, StateContext } from '@ngxs/store';
import { SetEmptyPerson, SetPerson } from '../actions/person.action';
// export class CurrentStateModel{
//     user: Nani | Parent | undefined;
//     UserDetail: Person;

// }

// @state<CurrentStateModel>({
//     name:'current',
//     defaults:{
//         user:null,
//         UserDetail:null,
//     }
// })

export interface CurrentStateModel {
  user: User | null;
  UserDetail: Person | null;
  type: Nani | Parent | null;
}
let user1={
  id: 12001,
  UserName: 'Tom',
  password: '123123',
  hashPass: 'dsgs123efw',
  email: 'niznia@gmail.com',
  phonNumber: 1223213123123123,
  lastEntry: new Date(),
  history: []
}

@State<CurrentStateModel>({
  name: 'current',
  defaults: {
    user: user1,
    UserDetail: null,
    type: null,
  },
})
export class CurrentState {
  @Action(SetCurrentUser)
  SetCurrentUser(
    { getState, patchState }: StateContext<CurrentStateModel>,
    { payload }: SetCurrentUser
  ) {
    const state = getState();
    patchState({
      user: payload,
    });
  }

  @Action(SetEmptyUser)
  SetEmptyUser(
    { getState, patchState }: StateContext<CurrentStateModel>,
    {}: SetEmptyUser
  ) {
    patchState({
      user: null,
    });
  }
  @Action(SetPerson)
  SetCurrentPerson(
    { getState, patchState }: StateContext<CurrentStateModel>,
    { payload }: SetPerson
  ) {
    const state = getState();
    patchState({
      UserDetail: payload,
    });
  }

  @Action(SetEmptyPerson)
  SetEmptyPerson(
    { getState, patchState }: StateContext<CurrentStateModel>,
    {}: SetEmptyPerson
  ) {
    patchState({
      UserDetail: null,
    });
  }
  @Action(SetNani)
  SetType(
    { getState, patchState }: StateContext<CurrentStateModel>,
    { payload }: SetNani
  ) {
    patchState({
      type: payload,
    });
  }
  @Action(SetEmptyNani)
  SetEmptyNani(
    { getState, patchState }: StateContext<CurrentStateModel>,
    {}: SetEmptyNani
  ) {
    patchState({
      type: null,
    });
  }
  @Action(SetParent)
  SetParent(
    { getState, patchState }: StateContext<CurrentStateModel>,
    { payload }: SetParent
  ) {
    patchState({
      type: payload,
    });
  }
  @Action(SetEmptyParent)
  SetEmptyParent(
    { getState, patchState }: StateContext<CurrentStateModel>,
    {}: SetEmptyParent
  ) {
    patchState({
      type: null,
    });
  }
}
