import { AppFeature } from '@spryker-oryx/core';
import { userLoginComponent } from '../login/src/component';
import { userLogoutComponent } from '../logout/src/component';

export const userFeature: AppFeature = {
  components: [userLoginComponent, userLogoutComponent],
};
