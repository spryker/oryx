import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { finalize, of, tap } from 'rxjs';
import { AppInitializer, AppInitializerService } from './app-initializer';
import { DefaultAppInitializerService } from './default-app-initializer';

const obsSubscribed = vi.fn();
const obsComplete = vi.fn();
const promiseResolve = vi.fn();

const fnObsSubscribed = vi.fn();
const fnObsComplete = vi.fn();
const fnPromiseResolve = vi.fn();

const mockAInitializer = {
  initialize: vi.fn(),
};
const mockBInitializer = {
  initialize: vi
    .fn()
    .mockReturnValue(of(null).pipe(tap(obsSubscribed), finalize(obsComplete))),
};
const mockCInitializer = {
  initialize: vi.fn().mockResolvedValue(promiseResolve()),
};
const mockDInitializer = {
  initialize: vi.fn().mockRejectedValue('rejected'),
};

const mockFnInitializerA = vi.fn();
const mockFnInitializerB = vi.fn().mockImplementation(() => {
  fnPromiseResolve();
  return Promise.resolve();
});
const mockFnInitializerC = vi
  .fn()
  .mockReturnValue(
    of(null).pipe(tap(fnObsSubscribed), finalize(fnObsComplete))
  );
const mockFnInitializerD = vi.fn().mockRejectedValue('rejected');

describe('DefaultAppInitializerService', () => {
  let testInjector: Injector;

  beforeEach(async () => {
    testInjector = createInjector({
      providers: [
        {
          provide: AppInitializerService,
          useClass: DefaultAppInitializerService,
        },
        {
          provide: AppInitializer,
          useValue: mockAInitializer,
        },
        {
          provide: AppInitializer,
          useValue: mockBInitializer,
        },
        {
          provide: AppInitializer,
          useValue: mockCInitializer,
        },
        {
          provide: AppInitializer,
          useValue: mockFnInitializerA,
        },
        {
          provide: AppInitializer,
          useValue: mockFnInitializerB,
        },
        {
          provide: AppInitializer,
          useValue: mockFnInitializerC,
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when correct initializers are provided', () => {
    beforeEach(async () => {
      await testInjector.inject(AppInitializerService).initialize();
    });

    it('should call initializers and subscribe to observables', () => {
      expect(mockAInitializer.initialize).toHaveBeenCalled();
      expect(mockBInitializer.initialize).toHaveBeenCalled();
      expect(mockCInitializer.initialize).toHaveBeenCalled();
      expect(obsSubscribed).toHaveBeenCalled();
      expect(obsComplete).toHaveBeenCalled();
      expect(promiseResolve).toHaveBeenCalled();
    });

    it('should call function initializers and subscribe to observables', () => {
      expect(mockFnInitializerA).toHaveBeenCalled();
      expect(mockFnInitializerB).toHaveBeenCalled();
      expect(mockFnInitializerC).toHaveBeenCalled();
      expect(fnObsSubscribed).toHaveBeenCalled();
      expect(fnObsComplete).toHaveBeenCalled();
      expect(fnPromiseResolve).toHaveBeenCalled();
    });
  });

  describe('when class initializer is rejected', () => {
    beforeEach(async () => {
      testInjector.provide({
        provide: AppInitializer,
        useValue: mockDInitializer,
      });
    });

    it('should throw error if some promises will be rejected', async () => {
      await expect(() =>
        testInjector.inject(AppInitializerService).initialize()
      ).rejects.toThrow('rejected');
    });
  });

  describe('when function initializer is rejected', () => {
    beforeEach(async () => {
      testInjector.provide({
        provide: AppInitializer,
        useValue: mockFnInitializerD,
      });
    });

    it('should throw error if some promises will be rejected', async () => {
      await expect(() =>
        testInjector.inject(AppInitializerService).initialize()
      ).rejects.toThrow('rejected');
    });
  });
});
