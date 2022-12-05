import { Observable } from 'rxjs';
import { CheckoutStepType, CheckoutTrigger, ValidityReport } from '../models';

export interface CheckoutOrchestrationService {
  getTrigger(step: CheckoutStepType): Observable<CheckoutTrigger | null>;
  getValidity(): Observable<ValidityReport[]>;
  report(step: CheckoutStepType, isValid: boolean): void;
  submit(step?: CheckoutStepType): void;
}

export const CheckoutOrchestrationService = 'FES.CheckoutOrchestrationService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutOrchestrationService]: CheckoutOrchestrationService;
  }
}
