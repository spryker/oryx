import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { a11yConfig } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { POPOVER_HEIGHT } from '../popover.model';
import { DimensionController } from './dimension.controller';

const boundingElementSize = 20;
@customElement('fake-selected')
class FakeComponent extends LitElement {
  controller = new DimensionController(this);

  render(): TemplateResult {
    return html` <input placeholder="make a11y happy" />
      <oryx-popover>
        <div>test</div>
      </oryx-popover>`;
  }
}

describe('DimensionController', () => {
  let element: FakeComponent;

  const getBoundingClientRect = (
    bottom: number,
    left: number,
    top: number,
    right: number
  ): any => ({
    width: boundingElementSize,
    height: boundingElementSize,
    top,
    left,
    bottom: window.innerHeight - bottom,
    right: window.innerWidth - right,
  });

  const setDimensions = async (
    bottom = POPOVER_HEIGHT,
    left = 206,
    top = POPOVER_HEIGHT,
    right = 206
  ): Promise<void> => {
    element.getBoundingClientRect = (): any =>
      getBoundingClientRect(bottom, left, top, right);
    element.controller.setBoundingBox(element);

    element.requestUpdate();
    await elementUpdated(element);
  };

  beforeAll(async () => {
    element = await fixture(html`<fake-selected></fake-selected>`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible(a11yConfig);
  });

  describe('boundary element size', () => {
    beforeAll(async () => {
      await setDimensions();
    });

    it(`should set --_bounding-element-height equal ${boundingElementSize}px`, () => {
      expect(element.style.getPropertyValue('--_bounding-element-width')).toBe(
        `${boundingElementSize}px`
      );
    });

    it(`should set --_bounding-element-width equal ${boundingElementSize}px`, () => {
      expect(element.style.getPropertyValue('--_bounding-element-height')).toBe(
        `${boundingElementSize}px`
      );
    });
  });

  describe('when there is enough space', () => {
    describe('and there is no --oryx-popover-maxheight and --oryx-popover-maxwidth', () => {
      it('should not add the "up" attribute', () => {
        expect(element.hasAttribute('up')).toBe(false);
      });

      it('should not add the "end" attribute', () => {
        expect(element.hasAttribute('end')).toBe(false);
      });

      it('should not add the "start" attribute', () => {
        expect(element.hasAttribute('start')).toBe(false);
      });
    });
  });

  describe('when there is 100px available at the bottom and at the left', () => {
    beforeAll(async () => {
      element.style.setProperty('--oryx-popover-maxheight', '101px');
      element.style.setProperty('--oryx-popover-maxwidth', '101px');
      await setDimensions(100, 100);
    });

    describe('and the max-width and max-height is > 100px', () => {
      it('should add attributes', () => {
        expect(element.hasAttribute('up')).toBe(true);
        expect(element.hasAttribute('end')).toBe(true);
      });

      it('should not add attribute "start"', () => {
        expect(element.hasAttribute('start')).toBe(false);
      });
    });

    describe('and the max-height is set to 90px', () => {
      beforeAll(async () => {
        element.style.setProperty('--oryx-popover-maxheight', '90px');
        element.style.setProperty('--oryx-popover-maxwidth', '90px');
        await setDimensions(100, 100);
      });

      it('should not add attributes', () => {
        expect(element.hasAttribute('up')).toBe(false);
        expect(element.hasAttribute('end')).toBe(false);
        expect(element.hasAttribute('start')).toBe(false);
      });
    });

    describe('when there is 100px available at the bottom', () => {
      describe('and the max-height and the max-width are set to 200px', () => {
        describe('but there is less space at the top and at the end', () => {
          beforeAll(async () => {
            element.style.setProperty('--oryx-popover-maxheight', '200px');
            element.style.setProperty('--oryx-popover-maxwidth', '200px');
            await setDimensions(100, 100, 90, 90);
          });

          it('should not add the attributes', () => {
            expect(element.hasAttribute('up')).toBe(false);
            expect(element.hasAttribute('end')).toBe(false);
          });

          it('should add attribute "start"', () => {
            expect(element.hasAttribute('start')).toBe(true);
          });

          it('should set the --_available-popover-width-start to 100px', () => {
            expect(
              element.style.getPropertyValue('--_available-popover-width-start')
            ).toEqual('100px');
          });

          it('should set the --_available-popover-width-end to 90px', () => {
            expect(
              element.style.getPropertyValue('--_available-popover-width-end')
            ).toEqual('90px');
          });

          it('should set the --_available-popover-height to 100px', () => {
            expect(
              element.style.getPropertyValue('--_available-popover-height')
            ).toEqual('100px');
          });
        });
      });
    });
  });

  describe('directionality', () => {
    beforeAll(async () => {
      document.documentElement.style.direction = 'rtl';

      await setDimensions();
    });

    afterAll(() => {
      document.documentElement.style.direction = '';
    });

    it('should add "rtl" attribute', () => {
      expect(element.hasAttribute('rtl')).toBe(true);
    });
  });
});
