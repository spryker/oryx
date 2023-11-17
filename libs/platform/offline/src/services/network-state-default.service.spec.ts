import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { take } from 'rxjs';
import { NetworkStateDefaultService } from './network-state-default.service';
import { NetworkStateService } from './network-state.service';

describe('NetworkStateDefaultService', () => {
  let service: NetworkStateService;

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
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should return default online state', () => {
    service
      .online()
      .pipe(take(1))
      .subscribe((online) => {
        expect(online).toBe(true);
      });
  });

  describe('and network has gone offline', () => {
    beforeEach(() => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false);
      window.dispatchEvent(new Event('offline'));
    });

    it('should trigger the state', () => {
      service
        .online()
        .pipe(take(1))
        .subscribe((online) => {
          expect(online).toBe(false);
        });
    });

    describe('and connection was restored', () => {
      beforeEach(() => {
        vi.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true);
        window.dispatchEvent(new Event('online'));
      });

      it('should trigger the state', () => {
        service
          .online()
          .pipe(take(1))
          .subscribe((online) => {
            expect(online).toBe(true);
          });
      });
    });
  });
});
