import { AbstractFAPage } from './abstract.page';
import { PickingFragment } from '../page_fragments/picking.fragment';
import { WarehouseSelectionListFragment } from '../page_fragments/warehouse-selection-list.fragment';

export class WarehouseSelectionPage extends AbstractFAPage {
  url = '/warehouse-selection';
  warehouseSelectionListFragment = new WarehouseSelectionListFragment();

  selectWarehouse() {
    this.warehouseSelectionListFragment
      .getWarehouseSelectionButtons()
      .eq(0)
      .click();
  }
}
