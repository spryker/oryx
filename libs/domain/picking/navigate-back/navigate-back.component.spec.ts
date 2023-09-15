import { fixture } from '@open-wc/testing-helpers';
import { destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { PickingNavigateBackComponent } from './navigate-back.component';
import { pickingNavigateBackComponent } from './navigate-back.def';

describe('NavigateBackComponent', () => {
  let element: PickingNavigateBackComponent;

  beforeAll(async () => {
    await useComponent(pickingNavigateBackComponent);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-picking-navigate-back></oryx-picking-navigate-back>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when there is no url provided', () => {
    it('should use default url', () => {
      expect(element.renderRoot.querySelector('oryx-button')).toHaveProperty(
        'href',
        '/'
      );
    });
  });

  describe('when url prop is provided', () => {
    const url = '/url';

    beforeEach(async () => {
      element = await fixture(html`<oryx-picking-navigate-back
        .url=${url}
      ></oryx-picking-navigate-back>`);
    });

    it('should build the url based on provided url', () => {
      expect(element.renderRoot.querySelector('oryx-button')).toHaveProperty(
        'href',
        url
      );
    });
  });
});
