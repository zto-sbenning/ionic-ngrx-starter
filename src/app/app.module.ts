import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { MyApp } from './app.component';

import { reducers, facadesFactory, effectsFactory } from '../stores';
import { StorageProvider } from '../providers/storage/storage';
import { navStateSelector } from '../stores/nav.store';
import { HomePageModule } from '../pages/home/home.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { AboutPageModule } from '../pages/about/about.module';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';

const facades = facadesFactory({
  [navStateSelector]: {
    map: {
      HOME: HomePage,
      SETTINGS: SettingsPage,
      ABOUT: AboutPage,
    },
    links: [
      {
        page: 'HOME',
        idx: 0,
        sideMenu: {
          show: true,
          name: 'HOME',
          icon: 'home',
        },
        tabs: {
          show: true,
          name: 'HOME',
          icon: 'home',
        },
      },
      {
        page: 'SETTINGS',
        idx: 1,
        sideMenu: {
          show: true,
          name: 'SETTINGS',
          icon: 'settings',
        },
        tabs: {
          show: false,
          name: 'SETTINGS',
          icon: 'settings',
        },
      },
      {
        page: 'ABOUT',
        idx: 2,
        sideMenu: {
          show: true,
          name: 'ABOUT',
          icon: 'information-circle',
        },
        tabs: {
          show: false,
          name: 'ABOUT',
          icon: 'information-circle',
        },
      }
    ]
  }
});
const effects = effectsFactory({});

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    TabsPageModule,
    HomePageModule,
    SettingsPageModule,
    AboutPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ...facades,
    ...effects,
    StorageProvider
  ]
})
export class AppModule {}
