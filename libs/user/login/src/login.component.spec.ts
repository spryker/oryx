import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/core';
import { ExperienceService, RouterService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { SemanticLinkService } from '@spryker-oryx/site';
import '@spryker-oryx/testing';
import {
  PasswordInputComponent,
  PasswordVisibilityStrategy,
} from '@spryker-oryx/ui/password';
import { html } from 'lit';
import '../index';
import { UserLoginComponent } from './login.component';

class MockExperienceService implements Partial<ExperienceService> {
  getOptions = vi.fn();
}

class MockAuthService implements Partial<AuthService> {
  login = vi.fn();
}

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn();
}

class MockRouterService implements Partial<RouterService> {
  back = vi.fn();
  navigate = vi.fn();
}

describe('User Login', () => {
  let element: UserLoginComponent;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: MockExperienceService,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('default component', () => {
    beforeEach(async () => {
      element = await fixture(html`<user-login></user-login>`);
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(UserLoginComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('renders inputs', () => {
      expect(element?.shadowRoot?.querySelector('oryx-input')).toBeDefined();
    });

    it('renders click password strategy by default', () => {
      expect(
        (
          element?.shadowRoot?.querySelector(
            'oryx-password-input'
          ) as PasswordInputComponent
        ).strategy
      ).toBe('CLICK');
    });

    it('renders no remember me checkbox by default', () => {
      expect(element?.shadowRoot?.querySelector('oryx-checkbox')).toBeNull();
    });
  });

  describe('options', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<user-login
          .options="${{
            strategy: PasswordVisibilityStrategy.HOVER,
            remember: true,
          }}"
        ></user-login>`
      );
    });

    it('renders hover password strategy', () => {
      expect(
        (
          element?.shadowRoot?.querySelector(
            'oryx-password-input'
          ) as PasswordInputComponent
        ).strategy
      ).toBe('HOVER');
    });
    it('renders remember me checkbox', () => {
      expect(element?.shadowRoot?.querySelector('oryx-checkbox')).toBeDefined();
    });
  });
});
