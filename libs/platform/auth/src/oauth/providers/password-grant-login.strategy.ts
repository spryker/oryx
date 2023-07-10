import { AuthLoginStrategy, LoginRequest } from '@spryker-oryx/auth/login';
import { inject } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { OauthService } from '../oauth.service';
import { OauthPasswordProviderRequest } from './password-grant';

export class PasswordGrantAuthLoginStrategy implements AuthLoginStrategy {
  protected providerId = this.config.defaultProviderId;

  constructor(
    protected readonly config = inject(PasswordGrantAuthLoginStrategyConfig),
    protected readonly oauthService = inject(OauthService)
  ) {}

  login(request: LoginRequest): Observable<void> {
    return this.oauthService.loginWith(
      this.providerId,
      this.loginToPasswordRequest(request)
    );
  }

  setProviderId(providerId: string): void {
    this.providerId = providerId;
  }

  resetProviderId(): void {
    this.providerId = this.config.defaultProviderId;
  }

  protected loginToPasswordRequest(
    request: LoginRequest
  ): OauthPasswordProviderRequest {
    return { username: request.email, password: request.password };
  }
}

export interface PasswordGrantAuthLoginStrategyConfig {
  defaultProviderId: string;
}

export const PasswordGrantAuthLoginStrategyConfig =
  'oryx.PasswordGrantAuthLoginStrategyConfig';

declare global {
  interface InjectionTokensContractMap {
    [PasswordGrantAuthLoginStrategyConfig]: PasswordGrantAuthLoginStrategyConfig;
  }
}
