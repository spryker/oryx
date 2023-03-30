import { authButtonComponent, authLoginComponent } from '@spryker-oryx/auth';
import { AppFeature, ComponentsInfo } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { mockAuthProviders } from './mock-auth.providers';

export class MockAuthFeature implements AppFeature {
  components: ComponentsInfo = [authLoginComponent, authButtonComponent];

  providers: Provider[] = [...mockAuthProviders];
}
