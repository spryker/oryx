import { SimpleAppBuilder } from './app';
import { appBuilder } from './orchestration';

describe('app', () => {
  it('should return instance of SimpleAppBuilder', () => {
    expect(appBuilder()).toBeInstanceOf(SimpleAppBuilder);
  });
});
