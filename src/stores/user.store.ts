import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestMessage, Message, ResponseMessage } from '../models/message';

export interface UserCredentials {
  login: string;
  password: string;
}

export interface UserRole {
  id: string;
  ring: number;
  name: string;
}

export interface UserProfil {
  id?: string;
  password?: string;
  roles?: string[];
  email: string;
  username: string;
}

export interface UserState {
  firstUse: boolean;
  authentified: boolean;
  profil: UserProfil;
  credentials: UserCredentials;
  token: string;
}

export const initialUserState: UserState = {
  authentified: false,
  firstUse: null,
  profil: null,
  credentials: null,
  token: null
};

export const userStateSelector = 'user';
export const selectUserState = (states: any) =>
  states[userStateSelector] as UserState;
export const selectUserFirstUse = createSelector(
  selectUserState,
  (state: UserState) => state.firstUse
);
export const selectUserAuthentified = createSelector(
  selectUserState,
  (state: UserState) => state.authentified
);
export const selectUserProfil = createSelector(
  selectUserState,
  (state: UserState) => state.profil
);
export const selectUserCredentials = createSelector(
  selectUserState,
  (state: UserState) => state.credentials
);
export const selectUserToken = createSelector(
  selectUserState,
  (state: UserState) => state.token
);

export enum UserActionType {
  registerRequest = '[User] Register Request',
  authentifyRequest = '[User] Authentify Request',
  logoutRequest = '[User] Logout Request',
  setFirstUse = '[User] Set First Use',
  registerResponse = '[User] Register Response',
  authentifyResponse = '[User] Authentify Response',
  logoutResponse = '[User] Logout Response'
}

export class RegisterRequestUser extends RequestMessage<{
  profil: UserProfil;
}> {
  type = UserActionType.registerRequest;
}
export class AuthentifyRequestUser extends RequestMessage<{
  credentials: UserCredentials;
}> {
  type = UserActionType.authentifyRequest;
}
export class LogoutRequestUser extends RequestMessage<void> {
  type = UserActionType.logoutRequest;
}
export class SetFirstUseUser extends Message<{ firstUse: boolean }> {
  type = UserActionType.setFirstUse;
}
export class RegisterResponseUser extends ResponseMessage<{
  profil: UserProfil;
}> {
  type = UserActionType.registerResponse;
}
export class AuthentifyResponseUser extends ResponseMessage<{
  profil: UserProfil;
  token: string;
}> {
  type = UserActionType.authentifyResponse;
}
export class LogoutResponseUser extends ResponseMessage<void> {
  type = UserActionType.logoutResponse;
}

export type UserActions =
  | RegisterRequestUser
  | AuthentifyRequestUser
  | LogoutRequestUser
  | SetFirstUseUser
  | RegisterResponseUser
  | AuthentifyResponseUser
  | LogoutResponseUser;

export function userStateReducer(
  state: UserState = initialUserState,
  action: UserActions
): UserState {
  switch (action.type) {
    case UserActionType.setFirstUse: {
      const p = (action as SetFirstUseUser).payload;
      return {
        ...state,
        firstUse: p.firstUse,
      };
    }
    case UserActionType.registerResponse: {
      const p = (action as RegisterResponseUser).payload;
      return {
        ...state,
        profil: p.profil,
      };
    }
    case UserActionType.authentifyResponse: {
      const p = (action as AuthentifyResponseUser).payload;
      return {
        ...state,
        authentified: true,
        profil: p.profil,
        token: p.token,
      };
    }
    case UserActionType.logoutResponse: {
      const p = (action as LogoutResponseUser).payload;
      return {
        ...state,
        authentified: false,
        profil: null,
        credentials: null,
      };
    }
    case UserActionType.registerRequest:
    case UserActionType.authentifyRequest:
    case UserActionType.logoutRequest:
    default:
      return state;
  }
}

@Injectable()
export class UserFacade {
  user$: Observable<UserState> = this.store.pipe(select(selectUserState));
  firstUse$: Observable<boolean> = this.store.pipe(select(selectUserFirstUse));
  authentified$: Observable<boolean> = this.store.pipe(
    select(selectUserAuthentified)
  );
  profil$: Observable<UserProfil> = this.store.pipe(select(selectUserProfil));
  credentials$: Observable<UserCredentials> = this.store.pipe(
    select(selectUserCredentials)
  );
  token$: Observable<string> = this.store.pipe(select(selectUserToken));
  constructor(private store: Store<any>) {}
  registerRequest(payload: { profil: UserProfil }) {
    this.store.dispatch(new RegisterRequestUser(payload));
  }
  authentifyRequest(payload: { credentials: UserCredentials }) {
    this.store.dispatch(new AuthentifyRequestUser(payload));
  }
  logoutRequest() {
    this.store.dispatch(new LogoutRequestUser());
  }
  setFirstUse(payload: { firstUse: boolean }) {
    this.store.dispatch(new SetFirstUseUser(payload));
  }
}

@Injectable()
export class UserEffects {
  constructor(public actions$: Actions, public userFacade: UserFacade) {}
  @Effect({ dispatch: false })
  registerRequest$ = this.actions$.pipe(
    ofType(UserActionType.registerRequest),
    tap((registerRequest: RegisterRequestUser) =>
      console.log('UserEffects@registerRequest: ', registerRequest)
    )
  );
  @Effect({ dispatch: false })
  authentifyRequest$ = this.actions$.pipe(
    ofType(UserActionType.authentifyRequest),
    tap((authentifyRequest: AuthentifyRequestUser) =>
      console.log('UserEffects@authentifyRequest: ', authentifyRequest)
    )
  );
  @Effect({ dispatch: false })
  logoutRequest$ = this.actions$.pipe(
    ofType(UserActionType.logoutRequest),
    tap((logoutRequest: LogoutRequestUser) =>
      console.log('UserEffects@logoutRequest: ', logoutRequest)
    )
  );
  @Effect({ dispatch: false })
  setFirstUse$ = this.actions$.pipe(
    ofType(UserActionType.setFirstUse),
    tap((setFirstUse: SetFirstUseUser) =>
      console.log('UserEffects@setFirstUse: ', setFirstUse)
    )
  );
  @Effect({ dispatch: false })
  registerResponse$ = this.actions$.pipe(
    ofType(UserActionType.registerResponse),
    tap((registerResponse: RegisterResponseUser) =>
      console.log('UserEffects@registerResponse: ', registerResponse)
    )
  );
  @Effect({ dispatch: false })
  authentifyResponse$ = this.actions$.pipe(
    ofType(UserActionType.authentifyResponse),
    tap((authentifyResponse: AuthentifyResponseUser) =>
      console.log('UserEffects@authentifyResponse: ', authentifyResponse)
    )
  );
  @Effect({ dispatch: false })
  logoutResponse$ = this.actions$.pipe(
    ofType(UserActionType.logoutResponse),
    tap((logoutResponse: LogoutResponseUser) =>
      console.log('UserEffects@logoutResponse: ', logoutResponse)
    )
  );
}
