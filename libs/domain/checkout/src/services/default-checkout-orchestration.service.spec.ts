import {
  CheckoutOrchestrationService,
  CheckoutStepType,
  CheckoutTrigger,
  DefaultCheckoutOrchestrationService,
  Validity,
  ValidityReport,
} from '@spryker-oryx/checkout';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
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

    it('should emit on submit', async () =>
      new Promise<void>((done) => {
        trigger.subscribe((value) => {
          expect(value).toBe(CheckoutTrigger.Check);
          done();
        });

        service.submit(CheckoutStepType.Delivery);
      }));
  });

  describe('when multiple steps are registered', () => {
    beforeEach(async () => {
      service.getTrigger(CheckoutStepType.Delivery);
      service.getTrigger(CheckoutStepType.Shipping);
      service.getTrigger(CheckoutStepType.Payment);
    });

    describe('and getValidity() is triggered', () => {
      let validity: ValidityReport[];
      beforeEach(async () => {
        service
          .getValidity()
          .pipe(take(1))
          .subscribe((v) => (validity = v));
      });

      it('should return invalid for each step', () => {
        expect(validity?.[0].validity).toEqual(Validity.Invalid);
        expect(validity?.[1].validity).toEqual(Validity.Invalid);
        expect(validity?.[2].validity).toEqual(Validity.Invalid);
      });
    });

    describe('and report is being triggered on the first step', () => {
      beforeEach(async () => {
        service.report(CheckoutStepType.Delivery, true);
      });

      it('should change validity status', async () => {
        const validity = await firstValueFrom(service.getValidity());

        expect(validity[0].validity).toEqual(Validity.Valid);
      });
    });

    describe('and report is being triggered on the 2nd step', () => {
      beforeEach(async () => {
        service.report(CheckoutStepType.Shipping, true);
      });

      it('should change validity status', async () => {
        const validity = await firstValueFrom(service.getValidity());

        expect(validity[1].validity).toEqual(Validity.Valid);
      });
    });
  });

  describe('when no steps are registered', () => {
    describe('and getValidity() is triggered', () => {
      let validity: ValidityReport[];
      beforeEach(async () => {
        service
          .getValidity()
          .pipe(take(1))
          .subscribe((v) => (validity = v));
      });

      it('should not return any steps', () => {
        expect(validity).toBeUndefined();
      });
    });
  });
});
