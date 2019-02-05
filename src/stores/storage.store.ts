import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
import { RequestMessage, ResponseMessage } from '../models/message';
import { StorageProvider } from '../providers/storage/storage';
import { SetErrorApp } from './app.store';

export interface Entries {
  [key: string]: any;
}

export interface StorageState {
  loaded: boolean;
  entries: Entries;
}

export const initialStorageState: StorageState = {
  loaded: false,
  entries: null
};

export const storageStateSelector = 'storage';
export const selectStorageState = (states: any) =>
  states[storageStateSelector] as StorageState;
export const selectStorageLoaded = createSelector(
  selectStorageState,
  (state: StorageState) => state.loaded
);
export const selectStorageEntries = createSelector(
  selectStorageState,
  (state: StorageState) => state.entries
);

export enum StorageActionType {
  loadRequest = '[Storage] Load Request',
  saveRequest = '[Storage] Save Request',
  removeRequest = '[Storage] Remove Request',
  clearRequest = '[Storage] Clear Request',
  loadResponse = '[Storage] Load Response',
  saveResponse = '[Storage] Save Response',
  removeResponse = '[Storage] Remove Response',
  clearResponse = '[Storage] Clear Response'
}

export class LoadRequestStorage extends RequestMessage<
  { keys: string[] } | void
> {
  type = StorageActionType.loadRequest;
}
export class SaveRequestStorage extends RequestMessage<{ entries: Entries }> {
  type = StorageActionType.saveRequest;
}
export class RemoveRequestStorage extends RequestMessage<{ keys: string[] }> {
  type = StorageActionType.removeRequest;
}
export class ClearRequestStorage extends RequestMessage<void> {
  type = StorageActionType.clearRequest;
}
export class LoadResponseStorage extends ResponseMessage<{
  keys?: string[];
  entries: Entries;
}> {
  type = StorageActionType.loadResponse;
}
export class SaveResponseStorage extends ResponseMessage<{ entries: Entries }> {
  type = StorageActionType.saveResponse;
}
export class RemoveResponseStorage extends ResponseMessage<{ keys: string[] }> {
  type = StorageActionType.removeResponse;
}
export class ClearResponseStorage extends ResponseMessage<void> {
  type = StorageActionType.clearResponse;
}

export type StorageActions =
  | LoadRequestStorage
  | SaveRequestStorage
  | RemoveRequestStorage
  | ClearRequestStorage
  | LoadResponseStorage
  | SaveResponseStorage
  | RemoveResponseStorage
  | ClearResponseStorage;

export function storageStateReducer(
  state: StorageState = initialStorageState,
  action: StorageActions
): StorageState {
  switch (action.type) {
    case StorageActionType.loadResponse: {
      const p = (action as LoadResponseStorage).payload;
      return {
        ...state,
        entries: p.entries,
        loaded: true,
      };
    }
    case StorageActionType.saveResponse: {
      const p = (action as SaveResponseStorage).payload;
      return {
        ...state,
        entries: {
          ...(state.entries || {}),
          ...p.entries
        }
      };
    }
    case StorageActionType.removeResponse: {
      const p = (action as RemoveResponseStorage).payload;
      const clone = { ...state.entries };
      p.keys.forEach(key => delete clone[key]);
      return {
        ...state,
        entries: clone,
      };
    }
    case StorageActionType.clearResponse: {
      const p = (action as ClearResponseStorage).payload;
      return {
        ...state,
        entries: {}
      };
    }
    case StorageActionType.loadRequest:
    case StorageActionType.saveRequest:
    case StorageActionType.removeRequest:
    case StorageActionType.clearRequest:
    default:
      return state;
  }
}

@Injectable()
export class StorageFacade {
  storage$: Observable<StorageState> = this.store.pipe(
    select(selectStorageState)
  );
  loaded$: Observable<boolean> = this.store.pipe(select(selectStorageLoaded));
  entries$: Observable<Entries> = this.store.pipe(select(selectStorageEntries));
  constructor(private store: Store<any>) {}
  loadRequest(payload: { keys: string[] } | void) {
    this.store.dispatch(new LoadRequestStorage(payload));
  }
  saveRequest(payload: { entries: Entries }) {
    this.store.dispatch(new SaveRequestStorage(payload));
  }
  removeRequest(payload: { keys: string[] }) {
    this.store.dispatch(new RemoveRequestStorage(payload));
  }
  clearRequest() {
    this.store.dispatch(new ClearRequestStorage());
  }
}

@Injectable()
export class StorageEffects {
  constructor(
    public actions$: Actions,
    public storageFacade: StorageFacade,
    public storage: StorageProvider
  ) { }
  @Effect({ dispatch: false })
  loadRequest$ = this.actions$.pipe(
    ofType(StorageActionType.loadRequest),
    tap((loadRequest: LoadRequestStorage) =>
      console.log('StorageEffects@loadRequest: ', loadRequest)
    ),
  );
  @Effect({ dispatch: false })
  saveRequest$ = this.actions$.pipe(
    ofType(StorageActionType.saveRequest),
    tap((saveRequest: SaveRequestStorage) =>
      console.log('StorageEffects@saveRequest: ', saveRequest)
    )
  );
  @Effect({ dispatch: false })
  removeRequest$ = this.actions$.pipe(
    ofType(StorageActionType.removeRequest),
    tap((removeRequest: RemoveRequestStorage) =>
      console.log('StorageEffects@removeRequest: ', removeRequest)
    )
  );
  @Effect({ dispatch: false })
  clearRequest$ = this.actions$.pipe(
    ofType(StorageActionType.clearRequest),
    tap((clearRequest: ClearRequestStorage) =>
      console.log('StorageEffects@clearRequest: ', clearRequest)
    )
  );
  @Effect({ dispatch: false })
  loadResponse$ = this.actions$.pipe(
    ofType(StorageActionType.loadResponse),
    tap((loadResponse: LoadResponseStorage) =>
      console.log('StorageEffects@loadResponse: ', loadResponse)
    )
  );
  @Effect({ dispatch: false })
  saveResponse$ = this.actions$.pipe(
    ofType(StorageActionType.saveResponse),
    tap((saveResponse: SaveResponseStorage) =>
      console.log('StorageEffects@saveResponse: ', saveResponse)
    )
  );
  @Effect({ dispatch: false })
  removeResponse$ = this.actions$.pipe(
    ofType(StorageActionType.removeResponse),
    tap((removeResponse: RemoveResponseStorage) =>
      console.log('StorageEffects@removeResponse: ', removeResponse)
    )
  );
  @Effect({ dispatch: false })
  clearResponse$ = this.actions$.pipe(
    ofType(StorageActionType.clearResponse),
    tap((clearResponse: ClearResponseStorage) =>
      console.log('StorageEffects@clearResponse: ', clearResponse)
    )
  );

  @Effect()
  loadRequestSE$ = this.actions$.pipe(
    ofType(StorageActionType.loadRequest),
    switchMap((loadRequest: LoadRequestStorage) => this.storage.load().pipe(
      map((entries: Entries) => new LoadResponseStorage({ entries }, loadRequest.correlationId)),
      catchError((error: Error) => Observable.of(new SetErrorApp({ error }, loadRequest.correlationId)))
    ))
  );
}
