import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { NetworkStateDefaultService } from './network-state-default.service';
import { NetworkStateService } from './network-state.service';

describe('NetworkStateDefaultService', () => {
  let service: NetworkStateService;
  const callback = vi.fn();

  beforeAll(() => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true);

    const testInjector = createInjector({
      providers: [
        {
          provide: NetworkStateService,
          useClass: NetworkStateDefaultService,
        },
      ],
    });

    service = testInjector.inject(NetworkStateService);

    service.online().subscribe(callback);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should return default online state', () => {
    expect(callback).toHaveBeenCalledWith(true);
  });

  describe('and network has gone offline', () => {
    beforeEach(() => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false);
      window.dispatchEvent(new Event('offline'));
    });

    it('should trigger the state', () => {
      expect(callback).toHaveBeenCalledWith(false);
    });

    describe('and connection was restored', () => {
      beforeEach(() => {
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true);
        window.dispatchEvent(new Event('online'));
      });

      it('should trigger the state', () => {
        expect(callback).toHaveBeenCalledWith(true);
      });
    });
  });
});
