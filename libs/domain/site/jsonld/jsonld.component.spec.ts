import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { JsonLdService } from '../src/services';
import { SiteJsonLdComponent } from './jsonld.component';
import { siteJsonLdComponent } from './jsonld.def';

class MockJsonLdService implements Partial<JsonLdService> {
  getSchemas = vi.fn();
}

describe('SiteJsonLdComponent', () => {
  let element: SiteJsonLdComponent;
  let service: MockJsonLdService;

  beforeAll(async () => {
    await useComponent(siteJsonLdComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: JsonLdService,
          useClass: MockJsonLdService,
        },
      ],
    });
    service = injector.inject<MockJsonLdService>(JsonLdService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is initialised', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-site-jsonld></oryx-site-jsonld>`);
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(SiteJsonLdComponent);
    });
  });

  describe('when there are no schemas', () => {
    beforeEach(async () => {
      service.getSchemas.mockReturnValue(of([]));
      element = await fixture(html`<oryx-site-jsonld></oryx-site-jsonld>`);
    });

    it('should not render the json-ld script', () => {
      expect(element).not.toContainElement('script');
    });
  });

  describe('when there are schemas', () => {
    beforeEach(async () => {
      service.getSchemas.mockReturnValue(
        of([{ '@context': 'https://schema.org', '@type': 'WebSite' }])
      );
      element = await fixture(html`<oryx-site-jsonld></oryx-site-jsonld>`);
    });

    it('should render a json-ld script', () => {
      expect(element).toContainElement('script[type="application/ld+json"]');
    });
  });
});
