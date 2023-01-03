import {
  CheckoutOrchestrationService,
  CheckoutStepType,
  CheckoutTrigger,
  DefaultCheckoutOrchestrationService,
  Validity,
} from '@spryker-oryx/checkout';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { firstValueFrom, Observable, take } from 'rxjs';

describe('DefaultCheckoutOrchestrationService', () => {
  let service: CheckoutOrchestrationService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CheckoutOrchestrationService,
          useClass: DefaultCheckoutOrchestrationService,
        },
      ],
    });

    service = testInjector.inject(CheckoutOrchestrationService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCheckoutOrchestrationService);
  });

  describe('getTrigger', () => {
    let trigger: Observable<any>;

    beforeEach(() => {
      trigger = service.getTrigger(CheckoutStepType.Delivery).pipe(take(1));
    });

    it('should return an observable', () => {
      expect(trigger).toBeInstanceOf(Observable);
    });

    it('should emit on validity check', async () =>
      new Promise<void>((done) => {
        trigger.subscribe((value) => {
          expect(value).toBe(CheckoutTrigger.Report);
          done();
        });

        service.getValidity().pipe(take(1)).subscribe();
      }));

    it('should emit on submit', async () =>
      new Promise<void>((done) => {
        trigger.subscribe((value) => {
          expect(value).toBe(CheckoutTrigger.Check);
          done();
        });

        service.submit(CheckoutStepType.Delivery);
      }));
  });

  describe('getValidity', () => {
    it('should return an observable', () => {
      expect(service.getValidity()).toBeInstanceOf(Observable);
    });

    it('should be invalid by default', async () => {
      const validity = await firstValueFrom(service.getValidity());

      expect(validity[0].validity).toEqual(Validity.Invalid);
    });
  });

  describe('getStep', () => {
    it('should return an observable with step details', async () => {
      const { label, id } =
        (await firstValueFrom(service.getStep(CheckoutStepType.Delivery))) ??
        {};
      expect(label).toBe('checkout.<step>-delivery');
      expect(id).toBe(CheckoutStepType.Delivery);
    });
  });

  describe('report', () => {
    it('should change validity status', async () => {
      service.report(CheckoutStepType.Delivery, true);

      const validity = await firstValueFrom(service.getValidity());

      expect(validity[0]).toEqual({
        id: CheckoutStepType.Delivery,
        validity: Validity.Valid,
      });
    });
  });
});
