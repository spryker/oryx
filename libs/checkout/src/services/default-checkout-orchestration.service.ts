import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  CheckoutConfiguration,
  CheckoutStep,
  CheckoutStepType,
  CheckoutTrigger,
  Validity,
  ValidityReport,
} from '../models';
import { CheckoutOrchestrationService } from './checkout-orchestration.service';

interface StepData {
  trigger$: Subject<CheckoutTrigger | null>;
  validity$: BehaviorSubject<Validity>;
}

const defaultCheckoutSteps = [
  {
    id: CheckoutStepType.Delivery,
    label: 'checkout.delivery',
  },
  {
    id: CheckoutStepType.Shipping,
    label: 'checkout.shipping',
  },
  {
    id: CheckoutStepType.Payment,
    label: 'checkout.payment',
  },
];

export class DefaultCheckoutOrchestrationService
  implements CheckoutOrchestrationService
{
  protected stepsData: Map<CheckoutStepType, StepData> = new Map();

  protected validityTrigger$ = new BehaviorSubject(null);
  protected validity$ = this.validityTrigger$.pipe(
    switchMap(() => this.collectValidity()),
    tap((steps) => {
      const invalidStep = steps.find(
        ({ validity }) => validity === Validity.Invalid
      );
      if (invalidStep) {
        this.initReport(invalidStep.id);
      }
    })
  );

  constructor(protected checkoutSteps = defaultCheckoutSteps) {
    this.initCheckoutData(this.checkoutSteps);
  }

  getValidity(): Observable<ValidityReport[]> {
    return this.validity$;
  }

  getTrigger(step: CheckoutStepType): Observable<CheckoutTrigger | null> {
    return this.stepsData.get(step)!.trigger$;
  }

  getStep(step: CheckoutStepType): Observable<Required<CheckoutStep> | null> {
    const { id, label } = this.checkoutSteps.find((s) => s.id === step) ?? {};
    return of(id ? { id, label: label ?? id } : null);
  }

  report(step: CheckoutStepType, isValid = true): void {
    const currentStep = this.stepsData.get(step)!;
    currentStep.trigger$.next(null);
    currentStep.validity$.next(isValid ? Validity.Valid : Validity.Invalid);
    this.validityTrigger$.next(null);
  }

  submit(step?: string): void {
    for (const id of this.stepsData.keys()) {
      if (!step || step === id) {
        this.initCheck(id);
      }
    }
  }

  protected initCheck(step: CheckoutStepType): void {
    this.stepsData.get(step)!.trigger$.next(CheckoutTrigger.Check);
  }

  protected initReport(step: CheckoutStepType): void {
    this.stepsData.get(step)!.trigger$.next(CheckoutTrigger.Report);
  }

  protected collectValidity(): Observable<ValidityReport[]> {
    const validityStates = [...this.stepsData.entries()].map(([id, step]) =>
      step.validity$.pipe(map((validity) => ({ id, validity })))
    );
    return combineLatest(validityStates);
  }

  protected initCheckoutData(steps: CheckoutConfiguration): void {
    for (const step of steps) {
      this.stepsData.set(step.id, {
        trigger$: new Subject(),
        validity$: new BehaviorSubject<Validity>(Validity.Invalid),
      });
    }
  }
}
