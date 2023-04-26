import { Observable } from 'rxjs';
import { CheckoutStepType, CheckoutTrigger, ValidityReport } from '../models';

export interface CheckoutOrchestrationService {
  getTrigger(step: CheckoutStepType): Observable<CheckoutTrigger>;
  getValidity(): Observable<ValidityReport[]>;
  report(step: CheckoutStepType, isValid: boolean): void;
  submit(step?: CheckoutStepType): Observable<ValidityReport[]>;
}

export const CheckoutOrchestrationService = 'oryx.CheckoutOrchestrationService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutOrchestrationService]: CheckoutOrchestrationService;
  }
}
