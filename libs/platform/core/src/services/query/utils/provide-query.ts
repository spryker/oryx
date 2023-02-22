import { ValueProvider } from '@spryker-oryx/di';
import { CommandOptions } from '../command';
import { QueryOptions } from '../query';
import { COMMAND_TOKEN, EFFECT_TOKEN, QUERY_TOKEN } from '../query.service';

export function provideQuery<
  ValueType,
  Qualifier extends object | undefined = undefined
>(options: QueryOptions<ValueType, Qualifier> & { id: string }): ValueProvider {
  return {
    provide: `${QUERY_TOKEN}${options.id}`,
    useValue: options,
  };
}

export function provideCommand<
  ResultType,
  Qualifier extends object | undefined = undefined
>(
  options: CommandOptions<ResultType, Qualifier> & { id: string }
): ValueProvider {
  return {
    provide: `${COMMAND_TOKEN}${options.id}`,
    useValue: options,
  };
}

export function provideEffect(effect: any): ValueProvider {
  return {
    provide: EFFECT_TOKEN,
    useValue: effect,
  };
}
