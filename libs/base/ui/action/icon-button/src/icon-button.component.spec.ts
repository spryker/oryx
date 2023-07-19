import { fixture, html } from '@open-wc/testing-helpers';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { queryFirstAssigned, useComponent } from '@spryker-oryx/utilities';
import { IconButtonComponent } from './icon-button.component';
import { iconButtonComponent } from './icon-button.def';

describe('IconButtonComponent', () => {
  let element: IconButtonComponent;

  beforeAll(async () => {
    await useComponent(iconButtonComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-icon-button');
    expect(el).toBeInstanceOf(IconButtonComponent);
  });

  it('should render content', async () => {
    const id = 'test-button';
    element = await fixture(html`<oryx-icon-button>
      <button id=${id}>
        <oryx-icon .type=${IconTypes.Close}></oryx-icon>
      </button>
    </oryx-icon-button>`);

    const el = queryFirstAssigned(element, {
      selector: 'button',
    }) as HTMLElement;

    expect(el?.id).toBe(id);
  });
});
