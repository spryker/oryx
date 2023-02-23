import { Observable } from 'rxjs';
import { QueryService } from '../query.service';
import { QueryEvent } from './query-event';

export type CallbackEffect = [
  string,
  ({ event, query }: { event: QueryEvent; query: QueryService }) => void
];

export type StreamEffect = ({
  events$,
}: {
  events$: Observable<QueryEvent>;
  query: QueryService;
}) => Observable<unknown>;

export type EffectDefinition = CallbackEffect | StreamEffect;

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
