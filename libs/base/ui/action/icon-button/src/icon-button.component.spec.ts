import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { queryFirstAssigned } from '@spryker-oryx/utilities';
import { IconButtonComponent } from './icon-button.component';
import { iconButtonComponent } from './icon-button.def';

describe('IconButtonComponent', () => {
  let element: IconButtonComponent;

  beforeAll(async () => {
    await useComponent(iconButtonComponent);
  });

  it('should render content', async () => {
    const id = 'test-button';
    element = await fixture(html`<oryx-icon-button>
      <button id=${id}>
        <oryx-icon type="close"></oryx-icon>
      </button>
    </oryx-icon-button>`);

    const el = queryFirstAssigned(element, {
      selector: 'button',
    }) as HTMLElement;

    expect(el?.id).toBe(id);
  });
});
