import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { NavigateBackComponent } from './navigate-back.component';
import { navigateBackComponent } from './navigate-back.def';

describe('NavigateBackComponent', () => {
  let element: NavigateBackComponent;

  beforeAll(async () => {
    await useComponent(navigateBackComponent);
  });

  beforeEach(async () => {
    element = await fixture(html`<oryx-navigate-back></oryx-navigate-back>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when there is no url provided', () => {
    it('should use default url', () => {
      expect(element).toContainElement('a[href="/"]');
    });
  });

  describe('when url prop is provided', () => {
    const url = '/url';

    beforeEach(async () => {
      element = await fixture(html`<oryx-navigate-back
        .url=${url}
      ></oryx-navigate-back>`);
    });

    it('should build the url based on provided url', () => {
      expect(element).toContainElement(`a[href="${url}"]`);
    });
  });
});
