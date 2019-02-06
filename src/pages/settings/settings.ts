import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageFacade, Entries } from '../../stores/storage.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  loaded$: Observable<boolean> = this.storageFacade.loaded$;

  entries$: Observable<{ key: string, entry: any }[]> = this.storageFacade.entries$.pipe(
    map((entries: Entries) => Object.keys(entries || {}).map(key => ({ key, entry: entries[key] })))
  );

  selected: { key: string, entry: any };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storageFacade: StorageFacade
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  load() {
    this.storageFacade.loadRequest({ keys: undefined });
  }

}
