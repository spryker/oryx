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
  CheckoutSteps,
  checkoutStepsConfig,
  CheckoutTrigger,
  Validity,
  ValidityReport,
} from '../models';
import { CheckoutOrchestrationService } from './orchestration.service';

interface Step {
  id: CheckoutSteps;
  trigger$: Subject<CheckoutTrigger | null>;
  validity$: BehaviorSubject<Validity>;
}

export class DefaultCheckoutOrchestrationService
  implements CheckoutOrchestrationService
{
  protected steps = this.generateConfig(checkoutStepsConfig);

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

  getValidity(): Observable<ValidityReport[]> {
    return this.validity$;
  }

  getTrigger(step: string): Observable<CheckoutTrigger | null> {
    return this.getStep(step).trigger$;
  }

  report(step: string, isValid = true): void {
    const currentStep = this.getStep(step);
    currentStep.trigger$.next(null);
    currentStep.validity$.next(isValid ? Validity.Valid : Validity.Invalid);
    this.validityTrigger$.next(null);
  }

  submit(step?: string): void {
    for (const { id } of this.steps) {
      if (!step || step === id) {
        this.initCheck(id);
      }
    }
  }

  protected initCheck(step: string): void {
    this.getStep(step).trigger$.next(CheckoutTrigger.Check);
  }

  protected initReport(step: string): void {
    this.getStep(step).trigger$.next(CheckoutTrigger.Report);
  }

  protected getStep(step: string): Step {
    return this.steps.find(({ id }) => id === step) as Step;
  }

  protected collectValidity(): Observable<ValidityReport[]> {
    const validityStates = this.steps.map(({ validity$ }) => validity$);
    return combineLatest(validityStates).pipe(
      map((validities) =>
        validities.map((validity, i) => ({
          id: this.steps[i].id,
          validity,
        }))
      )
    );
  }

  protected generateConfig(steps: CheckoutSteps[]): Step[] {
    return steps.map((id) => ({
      id,
      trigger$: new Subject(),
      validity$: new BehaviorSubject<Validity>(Validity.Invalid),
    }));
  }
}
