import { fixture, html } from '@open-wc/testing-helpers';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { queryFirstAssigned, useComponent } from '@spryker-oryx/utilities';
import { IconButtonComponent } from './icon-button.component';
import { iconButtonComponent } from './icon-button.def';

const id = 'test-button';

describe('IconButtonComponent', () => {
  let element: IconButtonComponent;

  beforeAll(async () => {
    await useComponent(iconButtonComponent);
  });

  beforeEach(async () => {
    element = await fixture(html`<oryx-icon-button>
      <button id=${id}>
        <oryx-icon .type=${IconTypes.Close}></oryx-icon>
      </button>
    </oryx-icon-button>`);
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(IconButtonComponent);
  });

  it('should render content', async () => {
    const el = queryFirstAssigned(element, {
      selector: `button[id=${id}]`,
    });

    expect(el).not.toBeUndefined();
  });
});
