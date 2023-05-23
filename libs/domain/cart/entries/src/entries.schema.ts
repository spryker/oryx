import { ContentComponentSchema } from '@spryker-oryx/experience';
import { cartEntryComponentSchema } from '../../entry/src/entry.schema';
import { CartEntriesComponent } from './entries.component';

export const cartEntriesComponentSchema: ContentComponentSchema<CartEntriesComponent> =
  {
    ...cartEntryComponentSchema,
    name: 'Cart Entries',
  };
