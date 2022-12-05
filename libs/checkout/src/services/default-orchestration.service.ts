import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  CheckoutConfiguration,
  CheckoutStepType,
  CheckoutTrigger,
  Validity,
  ValidityReport,
} from '../models';
import { CheckoutOrchestrationService } from './orchestration.service';

interface StepData {
  trigger$: Subject<CheckoutTrigger | null>;
  validity$: BehaviorSubject<Validity>;
}

const defaultCheckoutSteps = [
  CheckoutStepType.Delivery,
  CheckoutStepType.Shipping,
  CheckoutStepType.Payment,
];

export class DefaultCheckoutOrchestrationService
  implements CheckoutOrchestrationService
{
  protected checkoutSteps = defaultCheckoutSteps;
  protected stepsData: Map<string, StepData> = new Map();

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

  constructor(protected config: CheckoutConfiguration = defaultCheckoutSteps) {
    this.initCheckoutData(config);
  }

  getValidity(): Observable<ValidityReport[]> {
    return this.validity$;
  }

  getTrigger(step: string): Observable<CheckoutTrigger | null> {
    return this.stepsData.get(step)!.trigger$;
  }

  report(step: string, isValid = true): void {
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

  protected initCheck(step: string): void {
    this.stepsData.get(step)!.trigger$.next(CheckoutTrigger.Check);
  }

  protected initReport(step: string): void {
    this.stepsData.get(step)!.trigger$.next(CheckoutTrigger.Report);
  }

  protected collectValidity(): Observable<ValidityReport[]> {
    const validityStates = [...this.stepsData.entries()].map(([id, step]) =>
      step.validity$.pipe(map((validity) => ({ id, validity })))
    );
    return combineLatest(validityStates);
  }

  protected initCheckoutData(
    steps: CheckoutConfiguration = this.checkoutSteps
  ): void {
    for (const step of steps) {
      this.stepsData.set(step, {
        trigger$: new Subject(),
        validity$: new BehaviorSubject<Validity>(Validity.Invalid),
      });
    }
  }
}
