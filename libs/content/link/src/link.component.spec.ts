import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector } from '@spryker-oryx/injector';
import { SemanticLinkType, SEMANTIC_LINK_PROVIDERS } from '@spryker-oryx/site';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { contentLinkComponent } from './index';
import { ContentLinkComponent } from './link.component';
import { LinkOptions, LinkType } from './link.model';

useComponent(contentLinkComponent);

class MockService {
  getOptions(): Observable<LinkOptions> {
    return of({});
  }
}

describe('ContentLinkComponent', () => {
  let element: ContentLinkComponent;
  let options: LinkOptions;

  createInjector({
    providers: [
      {
        provide: ExperienceService,
        useClass: MockService,
      },
      ...SEMANTIC_LINK_PROVIDERS,
    ],
  });

  beforeEach(async () => {
    options = {
      text: 'test',
      type: LinkType.RawUrl,
      id: 'test',
    };
    element = await fixture(
      html`<content-link .options=${options}></content-link>`
    );
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(ContentLinkComponent);
  });

  it('renders correct link when no type is provided', async () => {
    expect(element?.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      'test'
    );
  });

  it('renders correct text inside of the link', async () => {
    expect(element?.shadowRoot?.querySelector('a')?.innerText).toBe('test');
  });

  it('renders correct link when Category type is provided', async () => {
    options.type = SemanticLinkType.Category;
    element = await fixture(
      html`<content-link .options=${options}></content-link>`
    );
    expect(element?.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      '/category/test'
    );
  });

  it('renders correct link when Page type is provided', async () => {
    options.type = SemanticLinkType.Page;
    element = await fixture(
      html`<content-link .options=${options}></content-link>`
    );
    expect(element?.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      '/test'
    );
  });

  it('renders correct link when Product type is provided', async () => {
    options.type = SemanticLinkType.Product;
    element = await fixture(
      html`<content-link .options=${options}></content-link>`
    );
    expect(element?.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      '/product/test'
    );
  });

  it('renders unmodified link when RawUrl type is provided', async () => {
    options.type = LinkType.RawUrl;
    element = await fixture(
      html`<content-link .options=${options}></content-link>`
    );
    expect(element?.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      'test'
    );
  });

  it('renders correct link when correct type and no slash in href is provided', async () => {
    options.type = SemanticLinkType.Category;
    element = await fixture(
      html`<content-link .options=${options}></content-link>`
    );
    expect(element?.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      '/category/test'
    );
  });

  it('properly resolves rel attribute', async () => {
    options.noopener = true;
    options.nofollow = true;
    element = await fixture(
      html`<content-link .options=${options}></content-link>`
    );
    expect(element?.shadowRoot?.querySelector('a')?.getAttribute('rel')).toBe(
      'noopener nofollow'
    );
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
