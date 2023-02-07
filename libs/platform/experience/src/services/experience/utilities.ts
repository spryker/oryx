import { filter, fromEvent, map, Observable, shareReplay } from 'rxjs';
import {
  DataIds,
  ExperienceMessageData,
  ExperienceMessageType,
  MessageType,
} from './data-client';

export const postMessage = <T>(
  message: T extends MessageType ? ExperienceMessageData<T> : unknown,
  sender?: Window
): void => {
  setTimeout(() => {
    if (sender) {
      sender.postMessage(message, '*');

      return;
    }

    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage(message, '*');
    }
  });
};

export const catchMessage = <T extends MessageType, K extends DataIds>(
  type: T,
  key: K
): Observable<ExperienceMessageData<T>[K]> => {
  return fromEvent<ExperienceMessageType<T>>(window, 'message').pipe(
    filter((e) => e.data?.type === type),
    map((data) => data.data[key]),
    shareReplay({ bufferSize: 1, refCount: true })
  );
};
