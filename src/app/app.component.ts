import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Link, NavFacade } from '../stores/nav.store';
import { Observable } from 'rxjs';
import { map, switchMap, filter, tap } from 'rxjs/operators';
import { TabsPage } from '../pages/tabs/tabs';
import { AppFacade } from '../stores/app.store';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = TabsPage;
  links$: Observable<Link[]>;

  ready: boolean;

  constructor(
    public appFacade: AppFacade,
    public navFacade: NavFacade,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    this.links$ = this.navFacade.links$.pipe(
      map(links => Object.keys(links).map(key => links[key]))
    );
    const platformReady$ = Observable.defer(
      () => Observable.fromPromise(platform.ready())
    );

    this.appFacade.initializeRequest();

    platformReady$.pipe(
      // tap(() => this.appFacade.setReady({ ready: true })),
      switchMap(() => this.appFacade.ready$.pipe(
        tap((ready: boolean) => this.ready = ready),
        filter((ready: boolean) => ready === true),
      ))
    ).subscribe(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goto(link: Link) {
    this.navFacade.setRoot({ page: link.page });
  }
}

