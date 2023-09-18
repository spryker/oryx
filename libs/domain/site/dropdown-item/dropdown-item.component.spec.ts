import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LinkService } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { DropdownItemComponent } from './dropdown-item.component';
import { dropdownItemComponent } from './dropdown-item.def';

class MockLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of('/'));
}

describe('DropdownItemComponent', () => {
  let element: DropdownItemComponent;
  let service: MockLinkService;

  beforeAll(async () => {
    await useComponent(dropdownItemComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: LinkService,
          useClass: MockLinkService,
        },
      ],
    });

    service = testInjector.inject(LinkService) as MockLinkService;

    element = await fixture(
      html`<oryx-site-dropdown-item></oryx-site-dropdown-item>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(DropdownItemComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render components', () => {
    expect(element).toContainElement('oryx-dropdown-item');
  });

  describe('when dropdown has content', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-dropdown-item
          .content=${{ text: 'mock' }}
        ></oryx-site-dropdown-item>`
      );
    });

    it('should render text', () => {
      expect(
        element.renderRoot.querySelector('oryx-dropdown-item')
      ).toHaveProperty('text', 'mock');
    });
  });

  describe('when dropdown has a url', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-dropdown-item
          .options=${{ url: 'mock' }}
        ></oryx-site-dropdown-item>`
      );
    });

    it('should render anchor link', () => {
      expect(
        element.renderRoot.querySelector('oryx-dropdown-item')
      ).toHaveProperty('url', 'mock');
    });

    describe('and url is a link option', () => {
      const linkOption = { type: 'mock', id: 'id' };
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-dropdown-item
            .options=${{ url: linkOption }}
          ></oryx-site-dropdown-item>`
        );
      });

      it('should resolve anchor link', () => {
        expect(service.get).toHaveBeenCalledWith(linkOption);
      });

      it('should render anchor link', () => {
        expect(
          element.renderRoot.querySelector('oryx-dropdown-item')
        ).toHaveProperty('url', '/');
      });
    });
  });

  describe('when dropdown has an icon', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-dropdown-item
          .options=${{ icon: IconTypes.Add }}
        ></oryx-site-dropdown-item>`
      );
    });
    it('should render icon', () => {
      expect(
        element.renderRoot.querySelector('oryx-dropdown-item')
      ).toHaveProperty('icon', IconTypes.Add);
    });
  });
});
