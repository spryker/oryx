import { createCommand, createEffect, createQuery } from './create';

import { QueryOptions } from '@spryker-oryx/core';
import { of } from 'rxjs';

vi.mock('@spryker-oryx/di', () => ({
  inject: vi.fn().mockReturnValue({
    createQuery: vi.fn((arg) => arg.id),
    createCommand: vi.fn((arg) => arg.id),
    createEffect: vi.fn((effect) => ({
      effect,
    })),
  }),
}));

describe('factories', () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('createQuery', () => {
    it('should create a new query using the query service', () => {
      const options: QueryOptions<number> = {
        id: 'test',
        loader: () => of(123),
      };
      const query = createQuery(options);

      expect(query).toEqual(options.id);
    });
  });

  describe('createCommand', () => {
    it('should create a new command using the query service', () => {
      const options = { id: 'test', action: async () => 'hello' };
      const command = createCommand(options);
      expect(command).toEqual(options.id);
    });
  });

  describe('createEffect', () => {
    it('should create a new effect using the query service', () => {
      const effect = vi.fn();
      const result = createEffect(effect);
      expect(result).toEqual({ effect });
    });
  });
});
