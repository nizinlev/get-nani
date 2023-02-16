import { SetType, SetEmptyType } from './../actions/nani.action';
import { SetEmptyParent } from './../actions/parent.action';
import { User } from './../models/user.model';
import { SetCurrentUser, SetEmptyUser } from './../actions/user.action';
import { Parent } from './../models/parent.model';
import { Nani } from './../models/nani.model';
import { Person } from '../models/person.model';
import { Action, State, StateContext } from '@ngxs/store';
import { SetEmptyPerson, SetPerson } from '../actions/person.action';


export interface CurrentStateModel {
  user: User | null;
  personDetails: Person | null;
  type: Nani | Parent | null;
}

@State<CurrentStateModel>({
  name: 'current',
  defaults: {
    user: null,
    personDetails: null,
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
      personDetails: payload,
    });
  }

  @Action(SetEmptyPerson)
  SetEmptyPerson(
    { getState, patchState }: StateContext<CurrentStateModel>,
    {}: SetEmptyPerson
  ) {
    patchState({
      personDetails: null,
    });
  }
  @Action(SetType)
  SetType(
    { getState, patchState }: StateContext<CurrentStateModel>,
    { payload }: SetType 
  ) {
    patchState({
      type: payload,
    });
  }
  @Action(SetEmptyType)
  SetEmptyType(
    { getState, patchState }: StateContext<CurrentStateModel>,
    {}: SetEmptyType
  ) {
    patchState({
      type: null,
    });
  }

}
