import { ModularAppBuilder } from './app';
import { appBuilder } from './orchestration';

describe('app', () => {
  it('should return instance of ModularAppBuilder', () => {
    expect(appBuilder()).toBeInstanceOf(ModularAppBuilder);
  });
});
