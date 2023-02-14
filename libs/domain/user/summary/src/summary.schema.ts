import { ContentComponentSchema } from '@spryker-oryx/experience';
import { UserSummaryComponent } from './summary.component';

export const userSummaryComponentSchema: ContentComponentSchema<UserSummaryComponent> =
  {
    name: 'User summary',
    group: 'User',
  };
