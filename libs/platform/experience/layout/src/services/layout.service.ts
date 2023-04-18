import { CompositionLayout } from '@spryker-oryx/experience';
import { Observable } from 'rxjs';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutService {
  getStyles(
    layout?: CompositionLayout,
    responsiveLayouts?: { [key: string]: CompositionLayout | undefined }
  ): Observable<string>;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
