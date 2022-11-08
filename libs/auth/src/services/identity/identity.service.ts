import { HttpInterceptor, HttpInterceptors } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Identity } from '../../models';

export const IdentityService = 'FES.IdentityService';
export const IdentityInterceptor = `${HttpInterceptors}Identity` as const;

export interface IdentityService {
  get(): Observable<Identity>;
}

declare global {
  interface InjectionTokensContractMap {
    [IdentityService]: IdentityService;
    [IdentityInterceptor]: HttpInterceptor;
  }
}
