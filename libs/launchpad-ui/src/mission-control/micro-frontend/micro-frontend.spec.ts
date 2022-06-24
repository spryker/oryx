import { fixture, fixtureCleanup } from '@open-wc/testing-helpers';
import { removeElement } from '@spryker-oryx/testing';
import { AjaxClient, wait } from '@spryker-oryx/typescript-utils';
import { html } from 'lit';
import { SpyInstance } from 'vitest';
import './index';
import { MicroFrontendComponent } from './micro-frontend';

const host = 'https://my-microfrontend.com';

describe('micro-frontend', () => {
  const render = (
    name: string,
    hosting: string
  ): Promise<MicroFrontendComponent> =>
    fixture(html`<oryx-micro-frontend .hosting=${hosting} .name=${name}>
      <h1>This is my microfrontend</h1>
    </oryx-micro-frontend>`);

  let element: MicroFrontendComponent;
  let getSpy: SpyInstance;

  beforeEach(() => {
    getSpy = vi.spyOn(AjaxClient, 'get');
  });

  afterEach(() => {
    fixtureCleanup();
  });

  describe('when the attribute name and hosting are set', () => {
    it('should render the loading mask while fetching the data', async () => {
      element = await render('test-mf', host);

      expect('[data-testid="loading-mask"]').toBeInDOMBy(element);
    });

    it('should not render the component', async () => {
      element = await render('test-mf', host);

      expect('h1').not.toBeInDOMBy(element);
    });

    describe('when the manifest is loaded properly', () => {
      const loadAssets = (): void => {
        expectedAssets.forEach(([, selector]) => {
          const asset = document.querySelector(selector);

          asset?.dispatchEvent(new Event('load'));
        });
      };
      const expectedAssets: [string, string][] = [
        ['style', `head [href="${host}/assets/index.8d81c154.css"]`],
        ['entry point', `[src="${host}/assets/index.78fb593b.js"]`],
        ['vendor', `[src="${host}/assets/vendor.a068f0c7.js"]`],
      ];

      beforeEach(async () => {
        getSpy.mockReturnValue(
          Promise.resolve({
            'index.ts': {
              file: 'assets/index.78fb593b.js',
              src: 'index.ts',
              isEntry: true,
              imports: ['_vendor.a068f0c7.js'],
              css: ['assets/index.8d81c154.css'],
            },
            '_vendor.a068f0c7.js': {
              file: 'assets/vendor.a068f0c7.js',
            },
          })
        );

        element = await render('test-mf', host);
        loadAssets();
        await wait(10);
      });

      afterEach(() =>
        expectedAssets.forEach(([, selector]) => removeElement(selector))
      );

      expectedAssets.forEach(([name, selector]) => {
        it(`should inject the ${name} file in the DOM`, () => {
          expect(selector).toBeInDOM();
        });
      });

      it('should hide the loading mask', () => {
        expect('[data-testid="loading-mask"]').not.toBeInDOMBy(element);
      });

      it('should render the component', () => {
        expect('h1').toBeSlottedBy(element);
      });

      describe('if the micro frontend is mounted again', () => {
        beforeEach(async () => {
          element = await render('test-mf', host);
        });

        it('should not render the loading again', () => {
          expect('[data-testid="loading-mask"]').not.toBeInDOMBy(element);
        });

        it('should render the component', () => {
          expect('h1').toBeSlottedBy(element);
        });
      });
    });

    describe('when the manifest cannot be loaded', () => {
      beforeEach(async () => {
        getSpy.mockReturnValue(
          Promise.resolve({ ok: false, message: 'Internal server error' })
        );

        element = await render('test-mf', host);
      });

      it('should not show the loading mask', () => {
        expect('[data-testid="loading-mask"]').not.toBeInDOMBy(element);
      });

      it('should not render the component', () => {
        expect('h1').not.toBeInDOMBy(element);
      });

      it('should render the error', () => {
        expect('[data-testid="error"]').toBeInDOMBy(element);
      });
    });
  });

  [
    ['test-mf', '', 'hosting'],
    ['', host, 'name'],
  ].forEach(([name, hosting, missing]) => {
    describe(`when the attribute ${missing} is not set`, () => {
      beforeEach(async () => {
        element = await render(name, hosting);
      });

      it('should not show the loading mask', () => {
        expect('[data-testid="loading-mask"]').not.toBeInDOMBy(element);
      });

      it('should not render the component', () => {
        expect('h1').not.toBeInDOMBy(element);
      });

      it('should render the error', () => {
        expect('[data-testid="error"]').toBeInDOMBy(element);
      });
    });
  });
});
