import { Observable } from 'rxjs';
import { CheckoutSteps, CheckoutTrigger, ValidityReport } from '../models';

export interface CheckoutOrchestrationService {
  getTrigger(step: CheckoutSteps): Observable<CheckoutTrigger | null>;
  getValidity(): Observable<ValidityReport[]>;
  report(step: CheckoutSteps, isValid: boolean): void;
  submit(step?: CheckoutSteps): void;
}

export const CheckoutOrchestrationService = 'FES.CheckoutOrchestrationService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutOrchestrationService]: CheckoutOrchestrationService;
  }
}
