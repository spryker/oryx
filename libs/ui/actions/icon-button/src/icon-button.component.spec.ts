import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import '@spryker-oryx/testing';
import { queryFirstAssigned } from '@spryker-oryx/typescript-utils';
import { iconButtonComponent } from './component';
import { IconButtonComponent } from './icon-button.component';

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
        <oryx-icon type="close"></oryx-icon>
      </button>
    </oryx-icon-button>`);

    const el = queryFirstAssigned(element, {
      selector: 'button',
    }) as HTMLElement;

    expect(el?.id).toBe(id);
  });
});
