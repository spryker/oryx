import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import '@spryker-oryx/testing';
import { queryFirstAssigned } from '@spryker-oryx/typescript-utils';
import { IconButtonComponent } from './icon-button.component';
import { iconButtonComponent } from './index';

useComponent(iconButtonComponent);

describe('IconButtonComponent', () => {
  let element: IconButtonComponent;

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
