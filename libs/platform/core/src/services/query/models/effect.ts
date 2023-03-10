import { Observable } from 'rxjs';
import { QueryManager } from '../core';
import { QueryService } from '../query.service';
import { QueryEvent } from './query-event';

export type CallbackEffect<Data = unknown, Qualifier = unknown> = [
  string,
  ({
    event,
    query,
  }: {
    event: QueryEvent<Data, Qualifier>;
    query: QueryService;
  }) => void
];

export type StreamEffect = ({
  events$,
}: {
  events$: Observable<QueryEvent>;
  getEvents: (
    eventType?: string | string[]
  ) => Observable<QueryEvent<any, any>>;
  query: QueryManager;
}) => Observable<unknown>;

export type EffectDefinition<Data = unknown, Qualifier = unknown> =
  | CallbackEffect<Data, Qualifier>
  | StreamEffect;

export function isStreamEffect(
  effect: EffectDefinition
): effect is StreamEffect {
  return typeof effect === 'function';
}

export function isCallbackEffect(
  effect: EffectDefinition
): effect is CallbackEffect {
  return Array.isArray(effect) && effect.length === 2;
}
