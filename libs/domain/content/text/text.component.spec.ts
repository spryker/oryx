import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { FontService } from '../src/services';
import { ContentTextComponent } from './text.component';
import { contentTextComponent } from './text.def';
import { ContentTextContent } from './text.model.js';

class MockFontService implements Partial<FontService> {
  install = vi.fn();
}

describe('ContentTextComponent', () => {
  let element: ContentTextComponent;
  let fontService: MockFontService;

  beforeAll(async () => {
    await useComponent(contentTextComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: FontService,
          useClass: MockFontService,
        },
      ],
    });

    fontService = injector.inject<MockFontService>(FontService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-content-text></oryx-content-text>`);
    });

    it('should defined', () => {
      expect(element).toBeInstanceOf(ContentTextComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when content is not provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-content-text></oryx-content-text>`);
    });

    it('should not render the text component', () => {
      expect(element).not.toContainElement('oryx-text');
    });
  });

  describe('when content is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-text
          .content=${{ text: '<p>content</p>' } as ContentTextContent}
        ></oryx-content-text>`
      );
    });

    it('should render the text component', () => {
      expect(element).toContainElement('oryx-text');
    });
  });

  describe('when autoInstallFont option is false ', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-text
          .options=${{ autoInstallFont: false }}
          .content=${{
            text: `<p style="font-family:'my-font'">content</p>`,
          } as ContentTextContent}
        ></oryx-content-text>`
      );
    });

    it('should not install the font', () => {
      expect(fontService.install).not.toHaveBeenCalledOnce();
    });
  });

  describe('when autoInstallFont option is true ', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-text
          .options=${{ autoInstallFont: true }}
          .content=${{
            text: `<p style="font-family:'my-font'">content</p>`,
          } as ContentTextContent}
        ></oryx-content-text>`
      );
    });

    it('should install the font', () => {
      expect(fontService.install).toHaveBeenCalledOnce();
    });
  });
});
