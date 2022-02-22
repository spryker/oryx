import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { OptionComponent } from './';
import './index';

describe('OptionComponent', () => {
  let element: OptionComponent;

  describe('when an icon is given', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-option .icon=${'mock'}></oryx-option>`
      );
    });

    it('should render the icon inside the option', () => {
      expect(element.shadowRoot?.querySelector(`oryx-icon:not(.mark)`)).to
        .exist;
    });
  });

  describe('parent', () => {
    describe('when an option is not added inside an oryx-select', () => {
      beforeEach(async () => {
        const parent = await fixture(
          html`<div><oryx-option .icon=${'mock'}></oryx-option></div>`
        );
        element = parent.querySelector('oryx-option') as OptionComponent;
      });

      it('should not add option attribute', () => {
        expect(element.getAttribute('slot')).not.eq('option');
      });
    });

    // TODO: bring back when we support select
    // describe('when an option is added inside an oryx-select', () => {
    //   beforeEach(async () => {
    //     const parent = await fixture(
    //       html`<oryx-select
    //         ><oryx-option .icon=${'mock'}></oryx-option
    //       ></oryx-select>`
    //     );
    //     element = parent.querySelector('oryx-option') as OptionComponent;
    //   });

    //   it('should add option attribute', () => {
    //     expect(element.getAttribute('slot')).eq('option');
    //   });
    // });
  });

  describe('values', () => {
    describe('when the item has no value', () => {
      beforeEach(async () => {
        const parent = await fixture(
          html`<div><oryx-option>mock inner text</oryx-option></div>`
        );
        element = parent.querySelector('oryx-option') as OptionComponent;
      });

      it('should return the innerText', () => {
        expect(element.value).to.eq('mock inner text');
      });
    });

    describe('when the item has a value', () => {
      beforeEach(async () => {
        const parent = await fixture(
          html`<div>
            <oryx-option value="mock value">mock inner text</oryx-option>
          </div>`
        );
        element = parent.querySelector('oryx-option') as OptionComponent;
      });

      it('should return the innerText', () => {
        expect(element.value).to.eq('mock value');
      });
    });
  });
});
