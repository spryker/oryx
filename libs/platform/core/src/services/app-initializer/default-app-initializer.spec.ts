import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { finalize, of, tap } from 'rxjs';
import { AppInitializer, AppInitializerService } from './app-initializer';
import { DefaultAppInitializerService } from './default-app-initializer';

const obsSubscribed = vi.fn();
const obsComplete = vi.fn();
const promiseResolve = vi.fn();

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

describe('DefaultAppInitializerService', () => {
  let testInjector: Injector;

  beforeEach(() => {
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
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should call initializers and subscribe to observables', async () => {
    await testInjector.inject(AppInitializerService).initialize();
    expect(mockAInitializer.initialize).toHaveBeenCalled();
    expect(mockBInitializer.initialize).toHaveBeenCalled();
    expect(mockCInitializer.initialize).toHaveBeenCalled();
    expect(obsSubscribed).toHaveBeenCalled();
    expect(obsComplete).toHaveBeenCalled();
    expect(promiseResolve).toHaveBeenCalled();
  });

  it('should throw error if some promises will be rejected', async () => {
    testInjector.provide({
      provide: AppInitializer,
      useValue: mockDInitializer,
    });

    await expect(() =>
      testInjector.inject(AppInitializerService).initialize()
    ).rejects.toThrow('rejected');
  });
});
