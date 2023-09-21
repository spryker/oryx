import {
  CoreResolver,
  CoreResourceResolver,
  TokenResourceResolvers,
} from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';

vi.mock('lit', async () => ({
  ...((await vi.importActual('lit')) as Array<unknown>),
  isServer: false,
}));

describe('CoreResolver', () => {
  let resolver: CoreResolver;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [CoreResourceResolver],
    });

    resolver = testInjector.inject(`${TokenResourceResolvers}CORE`);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('SERVER', () => {
    const callback = vi.fn();

    describe('when isServer is false', () => {
      beforeEach(() => {
        resolver.resolve('SERVER').subscribe(callback);
      });

      it(`should return false`, () => {
        expect(callback).toHaveBeenCalledWith(false);
      });
    });

    describe('when isServer is true', () => {
      beforeEach(async () => {
        const lit = await import('lit');
        (lit as { isServer: boolean }).isServer = true;

        resolver.resolve('SERVER').subscribe(callback);
      });

      it(`should return true`, () => {
        expect(callback).toHaveBeenCalledWith(true);
      });
    });
  });
});
