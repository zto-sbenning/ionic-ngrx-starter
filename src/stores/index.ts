import { appStateSelector, appStateReducer, AppFacade, AppEffects } from './app.store';
import { navStateSelector, navStateReducer, NavFacade, NavEffects } from './nav.store';
import { storageStateSelector, storageStateReducer, StorageFacade, StorageEffects } from './storage.store';
import { userStateSelector, userStateReducer, UserFacade, UserEffects } from './user.store';

export const reducers = {
  [appStateSelector]: appStateReducer,
  [navStateSelector]: navStateReducer,
  [storageStateSelector]: storageStateReducer,
  [userStateSelector]: userStateReducer,
};

export const facadesFactory = (config: { [selector: string]: any } = {}) => [
  AppFacade['forRoot'] ? AppFacade['forRoot'](config[appStateSelector]) : AppFacade,
  NavFacade['forRoot'] ? NavFacade['forRoot'](config[navStateSelector]) : NavFacade,
  StorageFacade['forRoot'] ? StorageFacade['forRoot'](config[storageStateSelector]) : StorageFacade,
  UserFacade['forRoot'] ? UserFacade['forRoot'](config[userStateSelector]) : UserFacade,
];

export const effectsFactory = (config: { [selector: string]: any } = {}) => [
  AppEffects['forRoot'] ? AppEffects['forRoot'](config[appStateSelector]) : AppEffects,
  NavEffects['forRoot'] ? NavEffects['forRoot'](config[navStateSelector]) : NavEffects,
  StorageEffects['forRoot'] ? StorageEffects['forRoot'](config[storageStateSelector]) : StorageEffects,
  UserEffects['forRoot'] ? UserEffects['forRoot'](config[userStateSelector]) : UserEffects,
];
