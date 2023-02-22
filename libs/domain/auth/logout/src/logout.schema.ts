import { ContentComponentSchema } from '@spryker-oryx/experience';
import { AuthLogoutComponent } from './logout.component';

export const authLogoutComponentSchema: ContentComponentSchema<AuthLogoutComponent> =
  {
    name: 'Auth logout',
    group: 'Auth',
  };
