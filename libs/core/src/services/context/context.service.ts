import { Observable } from 'rxjs';
import { CoreServices } from '../services';

export interface ContextService {
  provide(element: Element, key: string, value: unknown): void;
  get<T>(element: Element, key: string): Observable<T>;
  remove(element: Element, key: string): void;
}

declare global {
  interface InjectionTokensContractMap {
    [CoreServices.Context]: ContextService;
  }
}
