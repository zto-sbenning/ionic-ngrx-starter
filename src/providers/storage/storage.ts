import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { map, switchMap, defaultIfEmpty } from 'rxjs/operators';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  constructor(private storage: Storage) {
    console.log('Hello StorageProvider Provider');
  }

  load(): Observable<{ [key: string]: any }> {
    return Observable.defer(() => {
      return Observable.fromPromise(this.storage.ready()).pipe(
        switchMap(() => Observable.timer(2500).pipe(
          switchMap(() => Math.random() < 0.3
            ? Observable.throw(new Error('Random Error'))
            : Observable.of(0)
          )
        )),
        switchMap(() => Observable.fromPromise(this.storage.keys())),
        switchMap((keys: string[]) => Observable.zip(
          ...keys.map((key: string) => Observable.fromPromise(this.storage.get(key)).pipe(
            map((value: string) => ({ key, value }))
          ))
        )),
        defaultIfEmpty([]),
        map((entries: { key: string, value: any }[]) => entries.reduce((
          dict: { [key: string]: any },
          entry: { key: string, value: any }
        ) => ({
          ...dict,
          [entry.key]: entry.value
        }), {})),
      );
    });
  }

  save(dict: { [key: string]: any }): Observable<void> {
    return Observable.defer(() => {
      return Observable.fromPromise(this.storage.ready()).pipe(
        switchMap(() => Observable.zip(
          ...Object.keys(dict)
            .map((key: string) => Observable.fromPromise(this.storage.set(key, dict[key])))
        ).pipe(map(() => undefined)))
      );
    });
  }

  remove(keys: string[]): Observable<void> {
    return Observable.defer(() => {
      return Observable.fromPromise(this.storage.ready()).pipe(
        switchMap(() => Observable.zip(
          ...keys.map((key: string) => Observable.fromPromise(this.storage.remove(key)))
        ).pipe(map(() => undefined)))
      );
    });
  }

  clear(): Observable<void> {
    return Observable.defer(() => {
      return Observable.fromPromise(this.storage.ready()).pipe(
        switchMap(() => Observable.fromPromise(this.storage.clear()))
      );
    });
  }

}
