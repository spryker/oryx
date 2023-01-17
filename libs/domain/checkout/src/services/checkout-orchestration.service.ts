import { Observable } from 'rxjs';
import {
  CheckoutStep,
  CheckoutStepType,
  CheckoutTrigger,
  ValidityReport,
} from '../models';

export interface CheckoutOrchestrationService {
  getTrigger(step: CheckoutStepType): Observable<CheckoutTrigger | null>;
  getValidity(): Observable<ValidityReport[]>;
  getStep(step: CheckoutStepType): Observable<Required<CheckoutStep> | null>;
  report(step: CheckoutStepType, isValid: boolean): void;
  submit(step?: CheckoutStepType): Observable<ValidityReport[]>;
}

export const CheckoutOrchestrationService = 'FES.CheckoutOrchestrationService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutOrchestrationService]: CheckoutOrchestrationService;
  }
}
