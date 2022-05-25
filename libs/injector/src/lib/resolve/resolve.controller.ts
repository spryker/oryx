import { ReactiveController, ReactiveControllerHost } from 'lit';
import { resolve } from './resolve';

export interface ResolveProps {
  service: any;
  defaultValue?: any;
}

export class ResolveController implements ReactiveController {
  protected servicesMap = new Map<
    keyof InjectionTokensContractMap,
    ResolveProps
  >();

  constructor(protected host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  resolve<T>(token: keyof InjectionTokensContractMap): T {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.servicesMap.get(token)!.service;
  }

  add(token: keyof InjectionTokensContractMap, defaultValue?: any): void {
    this.servicesMap.set(token, {
      service: resolve(this.host, token, defaultValue),
      defaultValue,
    });
  }

  hostConnected(): void {
    for (const [key, resolveData] of this.servicesMap.entries()) {
      const providedService = resolve(this.host, key, resolveData.defaultValue);

      if (resolveData.service !== providedService) {
        this.servicesMap.set(key, {
          service: providedService,
          defaultValue: resolveData.defaultValue,
        });
      }
    }
  }
}
