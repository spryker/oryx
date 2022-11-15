import { HttpInterceptor } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Identity } from '../../models';

export const IdentityService = 'FES.IdentityService';
export const IdentityInterceptor = `${HttpInterceptor}Identity` as const;

export interface IdentityService {
  get(): Observable<Identity>;
}

declare global {
  interface InjectionTokensContractMap {
    [IdentityService]: IdentityService;
    [IdentityInterceptor]: HttpInterceptor;
  }
}
