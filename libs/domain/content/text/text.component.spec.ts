import { fixture } from '@open-wc/testing-helpers';
import { PageMetaService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { ContentTextComponent } from './text.component';
import { contentTextComponent } from './text.def';
import { ContentTextContent } from './text.model.js';

class MockPageMetaService implements Partial<PageMetaService> {
  add = vi.fn();
}

describe('ContentTextComponent', () => {
  let element: ContentTextComponent;
  let pageMetaService: MockPageMetaService;

  beforeAll(async () => {
    await useComponent(contentTextComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: PageMetaService,
          useClass: MockPageMetaService,
        },
      ],
    });

    pageMetaService = injector.inject<MockPageMetaService>(PageMetaService);
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

  describe('when content contains one font', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-text
          .content=${{
            text: `<p style="font-family:'my-font'">content</p>`,
          } as ContentTextContent}
        ></oryx-content-text>`
      );
    });

    it('should install the font', () => {
      expect(pageMetaService.add).toHaveBeenCalledOnce();
    });
  });

  describe('when content contains two fonts', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-text
          .content=${{
            text: `<p style="font-family:'my-first-font'">content</p><p style="font-family:'my-second-font'">content</p>`,
          } as ContentTextContent}
        ></oryx-content-text>`
      );
    });

    it('should install both fonts', () => {
      expect(pageMetaService.add).toHaveBeenCalledTimes(2);
    });
  });

  describe('when content contains the same font twice', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-text
          .content=${{
            text: `<p style="font-family:'my-first-font'">content</p><p style="font-family:'my-first-font'">content</p>`,
          } as ContentTextContent}
        ></oryx-content-text>`
      );
    });

    it('should install the fonts once', () => {
      expect(pageMetaService.add).toHaveBeenCalledOnce();
    });
  });
});
