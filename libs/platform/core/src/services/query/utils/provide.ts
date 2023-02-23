import { FactoryProvider, ValueProvider } from '@spryker-oryx/di';
import { CommandOptions } from '../command';
import { QueryOptions } from '../query';
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

export function provideEffect(effect: any): ValueProvider {
  return {
    provide: EFFECT_TOKEN,
    useValue: effect,
  };
}
