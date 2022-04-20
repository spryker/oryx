import { fixture } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { a11yConfig } from '../../../a11y';
import { MaxHeightController } from './max-height.controller';

@customElement('fake-selected')
class FakeComponent extends LitElement {
  controller = new MaxHeightController(this);

  render(): TemplateResult {
    return html` <input placeholder="make a11y happy" />
      <oryx-popover>
        <div>test</div>
      </oryx-popover>`;
  }
}

describe('MaxHeightController', () => {
  let element: FakeComponent;

  beforeEach(async () => {
    element = await fixture(html`<fake-selected> </fake-selected>`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible(a11yConfig);
  });

  describe('when there is enough space at the bottom', () => {
    beforeEach(() => {
      element.getBoundingClientRect = (): any => {
        return { top: 0, bottom: 100 };
      };
    });

    describe('and there is no --oryx-popover-maxheight', () => {
      beforeEach(() => {
        element.getBoundingClientRect = (): any => {
          return { top: 200, bottom: 300 };
        };
      });

      it('should not add the "up" attribute', () => {
        element.controller.setBoundingBox(element);
        expect(element.hasAttribute('up')).toBe(false);
      });
    });
  });

  describe('when there is 100px available at the bottom', () => {
    describe('and the max-height is > 100px', () => {
      beforeEach(() => {
        element.style.setProperty('--oryx-popover-maxheight', '101px');
        element.getBoundingClientRect = (): any => {
          return { top: 600, bottom: 700 };
        };
      });

      it('should add up attribute', () => {
        element.controller.setBoundingBox(element);
        expect(element.hasAttribute('up')).toBe(true);
      });
    });

    describe('and the max-height is set to 90px', () => {
      beforeEach(() => {
        element.style.setProperty('--oryx-popover-maxheight', '90px');
        element.getBoundingClientRect = (): any => {
          return { top: 400, bottom: 500 };
        };
      });

      it('should add up attribute', () => {
        element.controller.setBoundingBox(element);
        expect(element.hasAttribute('up')).toBe(false);
      });
    });

    describe('when there is 100px available at the bottom', () => {
      describe('and the max-height is set to 200px', () => {
        describe('but there is less space at the top', () => {
          beforeEach(() => {
            element.getBoundingClientRect = (): any => {
              return { top: 50, bottom: 700 };
            };
          });

          it('should not add the "up" attribute', () => {
            element.controller.setBoundingBox(element);
            expect(element.hasAttribute('up')).toBe(false);
          });

          it('should set the --_available-popover-height to 48px ', async () => {
            element.controller.setBoundingBox(element);
            expect(
              element.style.getPropertyValue('--_available-popover-height')
            ).toEqual('48px');
          });
        });
      });
    });
  });
});
