import { AppFeature } from '@spryker-oryx/core';
import { authLoginComponent } from '../login/src/component';
import { authLogoutComponent } from '../logout/src/component';
import { authProviders } from './services/providers';

export const authFeature: AppFeature = {
  providers: authProviders,
  components: [authLoginComponent, authLogoutComponent],
};
