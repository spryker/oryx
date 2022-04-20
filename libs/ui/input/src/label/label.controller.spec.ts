import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { a11yConfig } from '../../../a11y';
import { queryFirstAssigned } from '../../../utilities';
import { LabelController } from './label.controller';
import { LabelOptions } from './label.model';

@customElement('fake-label')
class LabelComponent extends LitElement implements LabelOptions {
  protected labelController = new LabelController(this);

  @property() label?: string;

  render(): TemplateResult {
    return html`
      <label>
        ${this.labelController.render()}
        <slot><input /></slot>
      </label>
    `;
  }
}

describe('LabelController', () => {
  let element: LabelComponent;

  describe('label', () => {
    describe('when a label is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html` <fake-label label="label content"></fake-label>`
        );
      });

      it('should render label content', () => {
        const label = queryFirstAssigned<HTMLDivElement>(element, {
          selector: 'div',
          slot: 'label',
          flatten: true,
        });
        expect(label?.textContent).toContain('label content');
      });

      it('should have an "has-label" attribute', () => {
        expect(element.hasAttribute('has-label')).toBe(true);
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });
    });

    describe('when a custom label is provided', () => {
      beforeEach(async () => {
        element = await fixture(html` <fake-label label="label content">
          <input />
          <h3>custom text</h3>
        </fake-label>`);
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not render a label element', () => {
        const customLabel = queryFirstAssigned(element, {
          flatten: true,
          slot: 'label',
          selector: 'h3',
        });
        expect(customLabel).toBeUndefined();
      });
    });

    describe('when a label is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-label></fake-label>`);
      });

      it('should not pass the a11y audit', async () => {
        await expect(element).shadowDom.not.be.accessible(a11yConfig);
      });

      it('should not render a label element', () => {
        const label = queryFirstAssigned<HTMLDivElement>(element, {
          selector: 'div',
          slot: 'label',
          flatten: true,
        });
        expect(label).toBeUndefined();
      });

      it('should not have an "has-label" attribute', () => {
        expect(element.hasAttribute('has-label')).toBe(false);
      });
    });
  });

  describe('required label', () => {
    describe('when the input is required', () => {
      describe('and the label does not have an asterisk', () => {
        beforeEach(async () => {
          element = await fixture(html`<fake-label label="test">
            <input required />
          </fake-label>`);
        });

        it('should pass the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should have an asterisk', () => {
          const label = queryFirstAssigned<HTMLDivElement>(element, {
            slot: 'label',
            selector: 'div',
            flatten: true,
          });
          expect(label?.textContent).toContain('test*');
        });
      });

      describe('and the label has an asterisk', () => {
        beforeEach(async () => {
          element = await fixture(html` <fake-label label="test*">
            <input required />
          </fake-label>`);
        });

        it('should pass the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not add an additional asterisk', () => {
          const label = queryFirstAssigned<HTMLDivElement>(element, {
            slot: 'label',
            selector: 'div',
            flatten: true,
          });
          expect(label?.textContent).not.toContain('text*');
        });
      });
    });

    describe('when the input is not required', () => {
      beforeEach(async () => {
        element = await fixture(html` <fake-label label="test">
          <input />
        </fake-label>`);
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should show a <sup>*</sup>', () => {
        expect(element.renderRoot.querySelector('sup')).toBeNull();
      });
    });
  });
});
