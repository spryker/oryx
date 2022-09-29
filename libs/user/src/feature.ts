import { AppFeature } from '@spryker-oryx/core';
import { userLoginComponent } from '../login/src/component';
import { userLogoutComponent } from '../logout/src/component';
import { userProviders } from './services';

export const userFeature: AppFeature = {
  providers: userProviders,
  components: [userLoginComponent, userLogoutComponent],
};
