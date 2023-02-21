import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { I18nService } from '@spryker-oryx/i18n';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { UserService } from '@spryker-oryx/user';
import { i18n } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { UserSummaryComponent } from './summary.component';
import { accountSummaryComponent } from './summary.def';

const mockLoginUrl = '/login';
const mockSubtitle = 'mockSubtitle';

class MockUserService implements Partial<UserService> {
  getUser = vi.fn().mockReturnValue(of(null));
}

class MockI18NService implements Partial<I18nService> {
  translate = vi.fn().mockReturnValue(of(mockSubtitle));
}

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn().mockReturnValue(of(mockLoginUrl));
}

describe('UserSummaryComponent', () => {
  let element: UserSummaryComponent;
  let userService: MockUserService;
  let linkService: MockSemanticLinkService;
  let i18nService: MockI18NService;

  beforeAll(async () => {
    await useComponent(accountSummaryComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: UserService,
          useClass: MockUserService,
        },
        {
          provide: I18nService,
          useClass: MockI18NService,
        },
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
      ],
    });

    userService = testInjector.inject(
      UserService
    ) as unknown as MockUserService;
    linkService = testInjector.inject(
      SemanticLinkService
    ) as unknown as MockSemanticLinkService;
    i18nService = testInjector.inject(
      I18nService
    ) as unknown as MockI18NService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('not logged in user', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-user-summary></oryx-user-summary>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render link', () => {
      expect(element).toContainElement('a');
    });

    it('should get link address from SemanticLinkService', () => {
      const link = element.renderRoot.querySelector('a');

      expect(linkService.get).toHaveBeenCalledWith({
        type: SemanticLinkType.Login,
      });
      expect(link?.getAttribute('href')).toBe(mockLoginUrl);
    });

    it('should render subtitle with translated Login', () => {
      const subtitle = element.renderRoot.querySelector(
        'oryx-heading'
      ) as HTMLElement;

      expect(subtitle.innerText.trim()).toBe(i18n('user.login'));
    });
  });

  describe('logged in user', () => {
    const mockUser = { firstName: 'firstName' };

    beforeEach(async () => {
      userService.getUser.mockReturnValue(of(mockUser));

      element = await fixture(html`<oryx-user-summary></oryx-user-summary>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render user firstName instead of Login title', () => {
      const subtitle = element.renderRoot.querySelector(
        'oryx-heading'
      ) as HTMLElement;

      expect(subtitle.innerText.trim()).toBe(mockUser.firstName);
    });
  });
});
