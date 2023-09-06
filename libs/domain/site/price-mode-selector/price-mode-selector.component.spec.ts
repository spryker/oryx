import { fixture, html } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { Subject } from 'rxjs';
import { NotificationService, PriceModeService } from '../src/services';
import { SitePriceModeSelectorComponent } from './price-mode-selector.component';
import { sitePriceModeSelectorComponent } from './price-mode-selector.def';

class MockPriceModeService implements Partial<PriceModeService> {
  get = vi.fn().mockReturnValue('GROSS_MODE');
  set = vi.fn();
}

const notificationTrigger$ = new Subject();

class MockNotificationService implements Partial<NotificationService> {
  get = vi.fn().mockReturnValue(notificationTrigger$);
}

describe('SitePriceModeSelectorComponent', () => {
  let element: SitePriceModeSelectorComponent;
  let priceModeService: MockPriceModeService;

  beforeAll(async () => {
    await useComponent([sitePriceModeSelectorComponent]);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: PriceModeService,
          useClass: MockPriceModeService,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
      ],
    });
    priceModeService = injector.inject(
      PriceModeService
    ) as unknown as MockPriceModeService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is initialized', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-price-mode-selector></oryx-price-mode-selector>`
      );
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(SitePriceModeSelectorComponent);
    });
  });
});
