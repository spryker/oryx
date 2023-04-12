import { BaseResolver, Resolver } from '@spryker-oryx/core';
import { of } from 'rxjs';

describe('BaseResolver', () => {
  const resolvers: Record<string, Resolver> = {
    TEST: () => of('test'),
  };

  const resolver = new (class extends BaseResolver<typeof resolvers> {
    protected resolvers = resolvers;
  })();

  describe('when token is provided', () => {
    const callback = vi.fn();

    beforeEach(() => {
      resolver.resolve('TEST').subscribe(callback);
    });

    it('should resolve the value', () => {
      expect(callback).toHaveBeenCalledWith('test');
    });
  });

  describe('when wrong token is provided', () => {
    const callback = vi.fn();
    const fakeToken = 'FAKE_TOKEN';
    const warn = vi.spyOn(global.console, 'warn');

    beforeEach(() => {
      resolver.resolve(fakeToken).subscribe(callback);
    });

    it('should throw a console warning', () => {
      expect(warn).toHaveBeenCalledWith(
        `Resolver ${fakeToken} is not supported`
      );
    });

    it('should resolve token name as result', () => {
      expect(callback).toHaveBeenCalledWith(fakeToken);
    });
  });
});
