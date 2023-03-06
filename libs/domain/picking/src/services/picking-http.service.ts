import { HttpService } from '@spryker-oryx/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PickingHttpService extends HttpService {}

export const PickingHttpService = 'oryx.PickingHttpService';

declare global {
  export interface InjectionTokensContractMap {
    [PickingHttpService]: PickingHttpService;
  }
}
