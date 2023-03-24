import { nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { finalize, interval, tap } from 'rxjs';
import { AppInitializer, AppInitializerService } from './app-initializer';
import { DefaultAppInitializerService } from './default-app-initializer';

const obsSubscribed = vi.fn();
const obsComplete = vi.fn();

const mockAInitializer = {
  initialize: vi.fn(),
};
const mockBInitializer = {
  initialize: vi
    .fn()
    .mockReturnValue(
      interval(10).pipe(tap(obsSubscribed), finalize(obsComplete))
    ),
};

describe('DefaultAppInitializerService', () => {
  let service: AppInitializerService;

  beforeEach(() => {
    const testInjector = createInjector({
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
      ],
    });
    service = testInjector.inject(AppInitializerService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('initialize', () => {
    it('should call initializers and subscribe to observables', async () => {
      service.initialize();
      expect(mockAInitializer.initialize).toHaveBeenCalled();
      expect(mockBInitializer.initialize).toHaveBeenCalled();
      await nextFrame();
      expect(obsSubscribed).toHaveBeenCalled();
    });
  });

  describe('onDestroy', () => {
    it('should unsubscribe from observables', async () => {
      service.initialize();
      await nextFrame();
      expect(obsSubscribed).toHaveBeenCalled();
      service.onDestroy();
      expect(obsComplete).toHaveBeenCalled();
    });
  });
});
