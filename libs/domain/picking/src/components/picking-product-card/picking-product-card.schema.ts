import {
  ComponentGroup,
  ContentComponentSchema,
} from '@spryker-oryx/experience';
import { PickingProductCardComponent } from './picking-product-card.component';

export const pickingListItemComponentSchema: ContentComponentSchema<PickingProductCardComponent> =
  {
    name: 'Picking product card',
    group: ComponentGroup.Picking,
  };
