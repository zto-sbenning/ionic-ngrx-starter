import { Action } from '@ngrx/store';
import * as uuid from 'uuid/v4';

export abstract class Message<T = any> implements Action {
  abstract type: string;
  constructor(
    public payload: T = {} as any,
    public correlationId: string = uuid()
  ) { }
}

export abstract class RequestMessage<T = any> extends Message<T> {
  startLoading = true;
}

export abstract class ResponseMessage<T = any> extends Message<T> {
  stopLoading = true;
}
