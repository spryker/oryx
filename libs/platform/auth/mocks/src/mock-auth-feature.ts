import {
  authLoginComponent,
  loginLinkComponent,
  oauthHandlerComponent,
} from '@spryker-oryx/auth';
import { AppFeature } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ComponentsInfo } from '@spryker-oryx/utilities';
import { mockAuthProviders } from './mock-auth.providers';

export class MockAuthFeature implements AppFeature {
  components: ComponentsInfo = [
    authLoginComponent,
    loginLinkComponent,
    oauthHandlerComponent,
  ];

  providers: Provider[] = [...mockAuthProviders];
}
