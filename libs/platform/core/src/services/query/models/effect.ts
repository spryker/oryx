import { Observable } from 'rxjs';
import { QueryService } from '../query.service';
import { StateEvent } from './state-event';

export type CallbackEffect = [
  string,
  ({ event, query }: { event: StateEvent; query: QueryService }) => void
];

export type StreamEffect = ($events: any) => Observable<any>;

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
