import { FormAssociatedElement } from '@spryker-oryx/utilities';
import { Observable, of } from 'rxjs';
import { LoginRequest } from './login.model';
import { AuthLoginStrategy } from './login.strategy';

export class DefaultAuthLoginStrategy implements AuthLoginStrategy {
  constructor(protected host: AuthLoginHost) {}

  login(request: LoginRequest): Observable<void> {
    if (this.host.form) {
      this.host.form.requestSubmit();
    } else if (request.email && request.password) {
      this.host.dispatchEvent(
        new AuthLoginEvent(undefined, {
          ...request,
          bubbles: true,
          composed: true,
          cancelable: false,
        })
      );
    }

    return of(undefined);
  }
}

export interface AuthLoginHost extends EventTarget, FormAssociatedElement {}

export class AuthLoginEvent extends Event {
  static readonly eventName = 'oryx.auth:login';

  email;
  password;
  rememberMe;

  constructor(
    type = AuthLoginEvent.eventName,
    { email, password, rememberMe, ...init }: AuthLoginEventInit
  ) {
    super(type, init);

    this.email = email;
    this.password = password;
    this.rememberMe = rememberMe;
  }
}

export interface AuthLoginEventInit extends LoginRequest, EventInit {}
