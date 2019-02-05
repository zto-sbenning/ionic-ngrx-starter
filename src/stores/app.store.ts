import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap, filter, map, skip, distinctUntilChanged } from 'rxjs/operators';
import { Message, RequestMessage, ResponseMessage } from '../models/message';
import { LoadingController, ToastController, AlertController, Loading, Alert, Toast } from 'ionic-angular';

export interface AppState {
  firstUse: boolean;
  ready: boolean;
  loading: boolean;
  loadingRefsCount: number;
  loadingTitle?: string;
  loadingMessage?: string;
  error: Error;
}

export const initialAppState: AppState = {
  firstUse: true,
  ready: false,
  loading: false,
  loadingRefsCount: 0,
  error: null
};

export const appStateSelector = 'app';
export const selectAppState = (states: any) =>
  states[appStateSelector] as AppState;
export const selectAppFirstUse = createSelector(
  selectAppState,
  (state: AppState) => state.firstUse
);
export const selectAppReady = createSelector(
  selectAppState,
  (state: AppState) => state.ready
);
export const selectAppLoading = createSelector(
  selectAppState,
  (state: AppState) => state.loading
);
export const selectAppError = createSelector(
  selectAppState,
  (state: AppState) => state.error
);

export enum AppActionType {
  setFirstUse = '[App] Set First Use',
  setReady = '[App] Set Ready',
  startLoading = '[App] Start Loading',
  stopLoading = '[App] Stop Loading',
  setError = '[App] Set Error',
  clearError = '[App] Clear Error'
}

export class SetFirstUseApp extends Message<{ firstUse: boolean }> {
  type = AppActionType.setFirstUse;
}
export class SetReadyApp extends Message<{ ready: boolean }> {
  type = AppActionType.setReady;
}
export class StartLoadingApp extends Message<{
  title?: string;
  message?: string;
}> {
  type = AppActionType.startLoading;
}
export class StopLoadingApp extends Message<void> {
  type = AppActionType.stopLoading;
}
export class SetErrorApp extends Message<{ error: Error }> {
  type = AppActionType.setError;
}
export class ClearErrorApp extends Message<void> {
  type = AppActionType.clearError;
}

export type AppActions =
  | SetFirstUseApp
  | SetReadyApp
  | StartLoadingApp
  | StopLoadingApp
  | SetErrorApp
  | ClearErrorApp;

export function appStateReducer(
  state: AppState = initialAppState,
  action: AppActions
): AppState {
  switch (action.type) {
    case AppActionType.setFirstUse: {
      const p = (action as SetFirstUseApp).payload;
      return {
        ...state,
        firstUse: p.firstUse,
      };
    }
    case AppActionType.setReady: {
      const p = (action as SetReadyApp).payload;
      return {
        ...state,
        ready: p.ready,
      };
    }
    case AppActionType.startLoading: {
      const p = (action as StartLoadingApp).payload;
      return {
        ...state,
        loadingRefsCount: state.loadingRefsCount + 1,
        loading: true,
        loadingTitle: p.title,
        loadingMessage: p.message,
      };
    }
    case AppActionType.stopLoading: {
      const p = (action as StopLoadingApp).payload;
      return {
        ...state,
        loadingRefsCount: state.loadingRefsCount - 1,
        loading: state.loadingRefsCount > 1,
        loadingTitle: state.loadingRefsCount > 1 ? state.loadingTitle : undefined,
        loadingMessage: state.loadingRefsCount > 1 ? state.loadingMessage : undefined,
      };
    }
    case AppActionType.setError: {
      const p = (action as SetErrorApp).payload;
      return {
        ...state,
        error: p.error,
      };
    }
    case AppActionType.clearError: {
      const p = (action as ClearErrorApp).payload;
      return {
        ...state,
        error: null
      };
    }

    default:
      return state;
  }
}

@Injectable()
export class AppFacade {
  app$: Observable<AppState> = this.store.pipe(select(selectAppState));
  firstUse$: Observable<boolean> = this.store.pipe(select(selectAppFirstUse));
  ready$: Observable<boolean> = this.store.pipe(select(selectAppReady));
  loading$: Observable<boolean> = this.store.pipe(select(selectAppLoading));
  error$: Observable<Error> = this.store.pipe(select(selectAppError));
  constructor(private store: Store<any>) {}
  setFirstUse(payload: { firstUse: boolean }) {
    this.store.dispatch(new SetFirstUseApp(payload));
  }
  setReady(payload: { ready: boolean }) {
    this.store.dispatch(new SetReadyApp(payload));
  }
  startLoading(payload: { title?: string; message?: string }) {
    this.store.dispatch(new StartLoadingApp(payload));
  }
  stopLoading() {
    this.store.dispatch(new StopLoadingApp());
  }
  setError(payload: { error: Error }) {
    this.store.dispatch(new SetErrorApp(payload));
  }
  clearError() {
    this.store.dispatch(new ClearErrorApp());
  }
}

@Injectable()
export class AppEffects {
  currentLoading: Loading;
  currentAlrt: Alert;
  currentToast: Toast;
  constructor(
    public actions$: Actions,
    public appFacade: AppFacade,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) { }
  @Effect({ dispatch: false })
  setFirstUse$ = this.actions$.pipe(
    ofType(AppActionType.setFirstUse),
    tap((setFirstUse: SetFirstUseApp) =>
      console.log('AppEffects@setFirstUse: ', setFirstUse)
    )
  );
  @Effect({ dispatch: false })
  setReady$ = this.actions$.pipe(
    ofType(AppActionType.setReady),
    tap((setReady: SetReadyApp) =>
      console.log('AppEffects@setReady: ', setReady)
    )
  );
  @Effect({ dispatch: false })
  startLoading$ = this.actions$.pipe(
    ofType(AppActionType.startLoading),
    tap((startLoading: StartLoadingApp) =>
      console.log('AppEffects@startLoading: ', startLoading)
    )
  );
  @Effect({ dispatch: false })
  stopLoading$ = this.actions$.pipe(
    ofType(AppActionType.stopLoading),
    tap((stopLoading: StopLoadingApp) =>
      console.log('AppEffects@stopLoading: ', stopLoading)
    )
  );
  @Effect({ dispatch: false })
  setError$ = this.actions$.pipe(
    ofType(AppActionType.setError),
    tap((setError: SetErrorApp) =>
      console.log('AppEffects@setError: ', setError)
    )
  );
  @Effect({ dispatch: false })
  clearError$ = this.actions$.pipe(
    ofType(AppActionType.clearError),
    tap((clearError: ClearErrorApp) =>
      console.log('AppEffects@clearError: ', clearError)
    )
  );
  @Effect()
  startLoadingViewRef$ = this.actions$.pipe(
    filter((request: RequestMessage) => request.startLoading === true),
    map((request: RequestMessage) => new StartLoadingApp())
  );
  @Effect()
  stopLoadingViewRef$ = this.actions$.pipe(
    filter((response: ResponseMessage) => response.stopLoading === true),
    map((response: ResponseMessage) => new StopLoadingApp())
  );
  @Effect({ dispatch: false })
  toggleLoadingView$ = this.appFacade.loading$.pipe(
    skip(1),
    distinctUntilChanged(),
    tap((loading: boolean) => {
      if (loading) {
        this.currentLoading = this.loadingCtrl.create({});
        this.currentLoading.present();
      } else {
        this.currentLoading.dismiss();
        this.currentLoading = undefined;
      }
    })
  );
  @Effect({ dispatch: false })
  setErrorView$ = this.actions$.pipe(
    ofType(AppActionType.setError),
    tap((setError: SetErrorApp) => {
      this.currentAlrt = this.alertCtrl.create({
        title: setError.payload.error.name,
        message: setError.payload.error.message,
        buttons: [{ text: 'Ok' }]
      });
      this.currentAlrt.present();
      this.currentAlrt.onDidDismiss(() => this.currentAlrt = undefined);
    })
  );
}


      /*
      {
      this.currentLoading = this.loadingCtrl.create({
        content: startLoading.payload.message,
      });
      this.currentLoading.present();
      }

    tap((stopLoading: StopLoadingApp) => {
      this.currentLoading.dismiss();
      this.currentLoading = undefined;
    })
      */
