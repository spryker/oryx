import { FactoryProvider, ValueProvider } from '@spryker-oryx/di';
import {
  CommandOptions,
  EffectDefinition,
  QueryEvent,
  QueryOptions,
} from '../models';
import { COMMAND_TOKEN, EFFECT_TOKEN, QUERY_TOKEN } from '../query.service';

export function provideQuery<
  ValueType,
  Qualifier extends object | undefined = undefined
>(
  id: string,
  query: () => QueryOptions<ValueType, Qualifier>
): FactoryProvider {
  return {
    provide: `${QUERY_TOKEN}${id}`,
    useFactory: query,
  };
}

export function provideCommand<
  ResultType,
  Qualifier extends object | undefined = undefined
>(
  id: string,
  command: () => CommandOptions<ResultType, Qualifier>
): FactoryProvider {
  return {
    provide: `${COMMAND_TOKEN}${id}`,
    useFactory: command,
  };
}

export function provideEffect<Event extends QueryEvent<any, any>>(
  effect: EffectDefinition<Event['data'], Event['qualifier']>
): ValueProvider;
export function provideEffect<Data = unknown, Qualifier = unknown>(
  effect: EffectDefinition<Data, Qualifier>
): ValueProvider;
export function provideEffect(effect: EffectDefinition): ValueProvider {
  return {
    provide: EFFECT_TOKEN,
    useValue: effect,
  };
}

export function provideFactoryEffect<Data = unknown, Qualifier = unknown>(
  callback: () => EffectDefinition<Data, Qualifier>
): FactoryProvider;
export function provideFactoryEffect<Data>(
  callback: () => EffectDefinition<Data>
): FactoryProvider {
  return {
    provide: EFFECT_TOKEN,
    useFactory: callback,
  };
}
