import { filter, fromEvent, map, Observable, shareReplay } from 'rxjs';
import {
  ExperienceMessageData,
  ExperienceMessageType,
  MessageType,
} from './data-client.model';

export const postMessage = <T>(
  message: T extends MessageType ? ExperienceMessageData<T> : unknown,
  sender?: Window
): void => {
  setTimeout(() => {
    if (sender) {
      sender.postMessage(message, '*');

      return;
    }

    if (typeof window !== 'undefined' && window.parent)
      window.parent.postMessage(message, '*');
  });
};

export const catchMessage = <T extends MessageType>(
  type: T
): Observable<ExperienceMessageData<T>['data']> => {
  return fromEvent<ExperienceMessageType<T>>(window, 'message').pipe(
    filter((e) => e.data?.type === type),
    map((e) => e.data.data),
    shareReplay({ bufferSize: 1, refCount: true })
  );
};
