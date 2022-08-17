import { ModularAppBuilder } from './app';
import { app } from './orchestration';

describe('app', () => {
  it('should return instance of ModularAppBuilder', () => {
    expect(app()).toBeInstanceOf(ModularAppBuilder);
  });
});
