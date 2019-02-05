import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { NavFacade, Link } from '../../stores/nav.store';
import { Observable } from 'rxjs';
import { filter, tap, map, withLatestFrom } from 'rxjs/operators';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  links$: Observable<Link[]>;
  map: { [page: string]: any };

  @ViewChild(Tabs) tabs: Tabs;

  constructor(
    public navFacade: NavFacade,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.map = NavFacade.map;
    this.links$ = this.navFacade.links$.pipe(
      map(links => Object.keys(links).map(key => links[key])),
      filter(links => !!links && links.length > 0),
      tap(() => setTimeout(() => {
        this.navFacade.registerTabs(this.tabs);
        this.tabs.ionChange.pipe(
          withLatestFrom(this.navFacade.root$)
        ).subscribe(([ev, root]) => {
          if (ev.root !== NavFacade.map[root]) {
            const link = NavFacade.links.find(link => NavFacade.map[link.page] === ev.root);
            this.navFacade.setRoot({ page: link.page });
          }
        });
      }, 0)),
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
