import { authLoginComponent } from '@spryker-oryx/auth/login';
import { loginLinkComponent } from '@spryker-oryx/auth/login-link';
import { oauthHandlerComponent } from '@spryker-oryx/auth/oauth-handler';
import { AppFeature, ComponentsInfo } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { mockAuthProviders } from './mock-auth.providers';

export class MockAuthFeature implements AppFeature {
  components: ComponentsInfo = [
    authLoginComponent,
    loginLinkComponent,
    oauthHandlerComponent,
  ];

  providers: Provider[] = [...mockAuthProviders];
}
