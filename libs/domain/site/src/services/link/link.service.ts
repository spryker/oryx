import { RouteType } from '@spryker-oryx/router';
import { Observable } from 'rxjs';

export interface LinkOptions<T = unknown> {
  type: RouteType | string;
  /** @deprecated since 1.4, use qualifier instead. */
  id?: string;
  qualifier?: T;
  params?: Record<string, string>;
}

export interface LinkService {
  get(link: LinkOptions): Observable<string | undefined>;

  /**
   * Checks if the current route matches or starts with the specified URL.
   * Asynchronously retrieves the current route and performs the check based on
   * the exactMatch option.
   *
   * @param {string} url - The URL to check against the current route.
   * @param {boolean} exactMatch - If true, checks for an exact match;
   * otherwise, checks if the current route starts with the specified URL.
   * @returns {Observable<boolean>} An observable that emits `true` if the current
   * route matches or starts with the specified URL, and `false` otherwise.
   */
  isCurrent(url: string, exactMatch?: boolean): Observable<boolean>;
}

export const LinkService = 'oryx.LinkService';

declare global {
  interface InjectionTokensContractMap {
    [LinkService]: LinkService;
  }
}
