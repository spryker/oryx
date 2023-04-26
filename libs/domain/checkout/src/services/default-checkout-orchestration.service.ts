import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  take,
  tap,
  using,
} from 'rxjs';
import {
  CheckoutStepType,
  CheckoutTrigger,
  Validity,
  ValidityReport,
} from '../models';
import { CheckoutOrchestrationService } from './checkout-orchestration.service';

interface StepData {
  trigger$: Subject<CheckoutTrigger>;
  validity$: BehaviorSubject<Validity>;
}

export class DefaultCheckoutOrchestrationService
  implements CheckoutOrchestrationService
{
  getTrigger(step: CheckoutStepType): Observable<CheckoutTrigger> {
    return this.get(step).trigger$;
  }

  getValidity(): Observable<ValidityReport[]> {
    return this.validity$;
  }

  report(step: CheckoutStepType, isValid = false): void {
    const stepData = this.get(step);
    stepData.validity$.next(isValid ? Validity.Valid : Validity.Invalid);
    this.validityTrigger$.next(null);
  }

  submit(step?: string): Observable<ValidityReport[]> {
    for (const id of this.stepsData.keys()) {
      if (!step || step === id) {
        this.initCheck(id);
      }
    }

    return this.collectValidity().pipe(
      filter((steps) =>
        steps.every(({ validity }) => validity !== Validity.Pending)
      ),
      take(1)
    );
  }

  protected validityTrigger$ = new Subject();

  protected validityLogic$ = this.validityTrigger$.pipe(
    switchMap(() => this.collectValidity()),
    debounceTime(0),
    tap((steps) => {
      const invalidStep = steps.find(
        ({ validity }) => validity === Validity.Invalid
      );
      if (invalidStep) {
        this.initReport(invalidStep.id);
      }
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected validity$ = using(
    () => this.validityLogic$.subscribe(),
    () =>
      this.collectValidity().pipe(
        shareReplay({ refCount: true, bufferSize: 1 })
      )
  );

  protected stepsData: Map<CheckoutStepType, StepData> = new Map();

  protected get(step: CheckoutStepType): StepData {
    if (!this.stepsData.get(step)) {
      this.stepsData.set(step, {
        trigger$: new Subject(),
        validity$: new BehaviorSubject<Validity>(Validity.Invalid),
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.stepsData.get(step)!;
  }

  protected initCheck(step: CheckoutStepType): void {
    const stepData = this.get(step);
    stepData.validity$.next(Validity.Pending);
    stepData.trigger$.next(CheckoutTrigger.Check);
  }

  protected initReport(step: CheckoutStepType): void {
    const stepData = this.get(step);
    if (stepData.validity$.value !== Validity.Pending) {
      stepData.trigger$.next(CheckoutTrigger.Report);
    }
  }

  protected collectValidity(): Observable<ValidityReport[]> {
    const validityStates = [...this.stepsData.entries()].map(([id, step]) =>
      step.validity$.pipe(map((validity) => ({ id, validity })))
    );
    return combineLatest(validityStates);
  }
}
