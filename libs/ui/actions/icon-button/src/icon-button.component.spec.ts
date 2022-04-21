import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { queryFirstAssigned } from '../../../utilities';
import { IconButtonComponent } from './icon-button.component';
import './index';

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

    expect(el?.id).toEqual(id);
  });
});
