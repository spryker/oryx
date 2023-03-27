import { CommandOptions, EffectDefinition, QueryOptions } from '../models';
import { COMMAND_TOKEN, EFFECT_TOKEN, QUERY_TOKEN } from '../query.service';
import { provideCommand, provideEffect, provideQuery } from './provide';

describe('provideQuery', () => {
  it('should provide a factory for a query with the given id', () => {
    const query: QueryOptions<string> = {
      loader: async () => '',
    };
    const factory = provideQuery('testQuery', () => query);

    expect(factory.provide).toBe(`${QUERY_TOKEN}testQuery`);
    expect(factory.useFactory).toBeInstanceOf(Function);
    expect(factory.useFactory()).toBe(query);
  });
});

describe('provideCommand', () => {
  it('should provide a factory for a command with the given id', () => {
    const command: CommandOptions<string> = {
      action: async () => '',
    };
    const factory = provideCommand('testCommand', () => command);

    expect(factory.provide).toBe(`${COMMAND_TOKEN}testCommand`);
    expect(factory.useFactory).toBeInstanceOf(Function);
    expect(factory.useFactory()).toBe(command);
  });
});

describe('provideEffect', () => {
  it('should provide a value for an effect', () => {
    const effect: EffectDefinition = ['event', () => ''];
    const provider = provideEffect(effect);

    expect(provider.provide).toBe(EFFECT_TOKEN);
    expect(provider.useValue).toBe(effect);
  });
});
