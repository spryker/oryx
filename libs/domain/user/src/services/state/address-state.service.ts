import { Observable } from 'rxjs';
import { CrudState } from '../../models';

export interface AddressStateService {
  /**
   * Sets the active address state. The address state is used to control the appearance of
   * address management components, to ensure they work seamless in multi or single page
   * experiences. Crudding address can be done using modals or inline editing, or scattered
   * over pages (e.g. addresses/create vs addresses/edit/123).
   */
  set(action: CrudState, id?: string | null): void;

  /**
   * Returns the action state and selected address.
   */
  get(): Observable<{ action: CrudState; selected: string | null }>;

  /**
   * Clears the address state. Both the action state as well as the selected item is cleared.
   * The cleared action state is Read, aka the list view.
   */
  clear(): void;
}

export const AddressStateService = 'oryx.AddressStateService';

declare global {
  interface InjectionTokensContractMap {
    [AddressStateService]: AddressStateService;
  }
}
