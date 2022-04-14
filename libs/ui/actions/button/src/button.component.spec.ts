import { expect, fixture, html } from '@open-wc/testing';
import { Size } from '../../../utilities';
import { ButtonComponent } from './button.component';
import { ButtonType } from './button.model';
import './index';

describe('ButtonComponent', () => {
  let element: ButtonComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-button');
    expect(el).to.be.instanceof(ButtonComponent);
  });

  describe('button type', () => {
    Object.values(ButtonType).forEach((type) => {
      describe(`when type is "${type}"`, () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-button
            type="${type}"
            size="small"
          ></oryx-button>`);
        });
        it('should reflect the type attribute on the node', () => {
          expect(element?.getAttribute('type')).to.equal(type);
        });
      });
    });
  });

  describe('button size', () => {
    Object.values(Size).forEach((size) => {
      describe(`when size is "${size}"`, () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-button
            type="primary"
            size="${size}"
          ></oryx-button>`);
        });

        it('should reflect the size attribute on the node', () => {
          expect(element?.getAttribute('size')).to.equal(size);
        });
      });
    });
  });

  describe('when button is disabled', () => {
    it('should reflect the disabled attribute on the host element', async () => {
      element = await fixture(
        html`<oryx-button><button disabled></button></oryx-button>`
      );
      expect(element.querySelector('button')?.hasAttribute('disabled')).to.be
        .true;
      expect(
        element.querySelector('button')?.setAttribute('disabled', 'disabled')
      );
    });

    it('should not have the disabled attribute after it is removed', async () => {
      element = await fixture(
        html`<oryx-button><button></button></oryx-button>`
      );
      expect(element.querySelector('button')?.hasAttribute('disabled')).to.be
        .false;
    });
  });

  describe('loading button', () => {
    describe('when the isLoading flag is not set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-button><button></button></oryx-button>`
        );
      });

      it('should not have a loading spinner', () => {
        expect(element.querySelector('oryx-icon[type=loader]')).to.not.exist;
      });
    });
  });

  describe('button with custom icon set through the slot', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-button type="primary" size="large">
          <oryx-icon slot="icon" size="large" type="close"></oryx-icon>
          Button
        </oryx-button>`
      );
    });

    it('should render icon', () => {
      expect(element?.querySelector('oryx-icon[type=close]')).to.exist;
    });
  });
});
