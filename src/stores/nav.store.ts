import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap, map, withLatestFrom } from 'rxjs/operators';
import { Message } from '../models/message';
import { Tabs, App, NavController } from 'ionic-angular';

export interface LinkContext {
  show: boolean;
  name: string;
  icon: string;
}

export interface Link {
  page: string;
  idx: number;
  sideMenu: LinkContext;
  tabs: LinkContext;
}

export interface NavState {
  links: { [page: string]: Link };
  root: string;
  stacks: { [page: string]: string[] };
}

export const initialNavState: NavState = {
  links: {},
  root: null,
  stacks: {}
};

export const navStateSelector = 'nav';
export const selectNavState = (states: any) =>
  states[navStateSelector] as NavState;
export const selectNavLinks = createSelector(
  selectNavState,
  (state: NavState) => state.links
);
export const selectNavRoot = createSelector(
  selectNavState,
  (state: NavState) => state.root
);
export const selectNavStacks = createSelector(
  selectNavState,
  (state: NavState) => state.stacks
);

export enum NavActionType {
  setLinks = '[Nav] Set Links',
  setRoot = '[Nav] Set Root',
  push = '[Nav] Push',
  pop = '[Nav] Pop'
}

export class SetLinksNav extends Message<{ links: Link[] }> {
  type = NavActionType.setLinks;
}
export class SetRootNav extends Message<{ page: string }> {
  type = NavActionType.setRoot;
}
export class PushNav extends Message<{ page: string }> {
  type = NavActionType.push;
}
export class PopNav extends Message<void> {
  type = NavActionType.pop;
}

export type NavActions = SetLinksNav | SetRootNav | PushNav | PopNav;

export function navStateReducer(
  state: NavState = initialNavState,
  action: NavActions
): NavState {
  switch (action.type) {
    case NavActionType.setLinks: {
      const p = (action as SetLinksNav).payload;
      return {
        ...state,
        links: p.links.reduce((links, link) => ({ ...links, [link.page]: link }), {}),
      };
    }
    case NavActionType.setRoot: {
      const p = (action as SetRootNav).payload;
      return {
        ...state,
        root: p.page
      };
    }
    case NavActionType.push: {
      const p = (action as PushNav).payload;
      return {
        ...state,
        stacks: {
          ...state.stacks,
          [state.root]: [
            ...(state.stacks[state.root] || []),
            p.page,
          ]
        }
      };
    }
    case NavActionType.pop: {
      const p = (action as PopNav).payload;
      return {
        ...state,
        stacks: {
          ...state.stacks,
          [state.root]: state.stacks[state.root].slice(0, -1),
        }
      };
    }

    default:
      return state;
  }
}

@Injectable()
export class NavFacade {
  static links: Link[];
  static map: { [page: string]: any };
  static forRoot(config: { links: Link[], map: { [page: string]: any } }): typeof NavFacade {
    NavFacade.links = config && config.links ? config.links : [];
    NavFacade.map = config && config.map ? config.map : {};
    return NavFacade;
  }
  nav$: Observable<NavState> = this.store.pipe(select(selectNavState));
  links$: Observable<{ [page: string]: Link }> = this.store.pipe(
    select(selectNavLinks)
  );
  root$: Observable<string> = this.store.pipe(select(selectNavRoot));
  stacks$: Observable<{ [page: string]: string[] }> = this.store.pipe(
    select(selectNavStacks)
  );
  private _tabs: Tabs;
  get tabs(): Tabs {
    return this._tabs;
  }
  constructor(private store: Store<any>) { }
  registerTabs(tabs: Tabs) {
    this._tabs = tabs;
  }
  setLinks(payload: { links: Link[] }) {
    this.store.dispatch(new SetLinksNav(payload));
  }
  setRoot(payload: { page: string }) {
    this.store.dispatch(new SetRootNav(payload));
  }
  push(payload: { page: string }) {
    this.store.dispatch(new PushNav(payload));
  }
  pop() {
    this.store.dispatch(new PopNav());
  }
}

@Injectable()
export class NavEffects {
  constructor(
    public actions$: Actions,
    public navFacade: NavFacade,
    public app: App
  ) { }
  @Effect({ dispatch: false })
  setLinks$ = this.actions$.pipe(
    ofType(NavActionType.setLinks),
    tap((setLinks: SetLinksNav) =>
      console.log('NavEffects@setLinks: ', setLinks)
    )
  );
  @Effect({ dispatch: false })
  setRoot$ = this.actions$.pipe(
    ofType(NavActionType.setRoot),
    tap((setRoot: SetRootNav) => console.log('NavEffects@setRoot: ', setRoot))
  );
  @Effect({ dispatch: false })
  push$ = this.actions$.pipe(
    ofType(NavActionType.push),
    tap((push: PushNav) => console.log('NavEffects@push: ', push))
  );
  @Effect({ dispatch: false })
  pop$ = this.actions$.pipe(
    ofType(NavActionType.pop),
    tap((pop: PopNav) => console.log('NavEffects@pop: ', pop))
  );

  @Effect()
  initNavFacadeLinks$ = Observable.timer(0).pipe(
    map(() => new SetLinksNav({ links: NavFacade.links })),
  );

  @Effect({ dispatch: false })
  selectTabOnSetRoot$ = this.actions$.pipe(
    ofType(NavActionType.setRoot),
    withLatestFrom(this.navFacade.root$),
    tap(([setRoot, page]: [SetRootNav, string]) => {
      this.navFacade.tabs.select(NavFacade.links.find(link => link.page === setRoot.payload.page).idx);
    })
  );
  @Effect({ dispatch: false })
  pushOnPush$ = this.actions$.pipe(
    ofType(NavActionType.push),
    tap((push: PushNav) => {
      this.app.getActiveNav().push(NavFacade.map[push.payload.page]);
    })
  );
  @Effect({ dispatch: false })
  popOnPop$ = this.actions$.pipe(
    ofType(NavActionType.push),
    tap(() => {
      this.app.getActiveNav().pop();
    })
  );
}
