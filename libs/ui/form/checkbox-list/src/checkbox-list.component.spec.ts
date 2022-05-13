import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { a11yConfig } from '../../../a11y';
import { Direction } from '../../../utilities/model';
import '../../checkbox/index';
import { CheckboxListComponent } from './checkbox-list.component';
import './index';

const groupData = [
  {
    label: 'Apple',
    checked: false,
  },
  {
    label: 'Orange',
    checked: true,
  },
  {
    label: 'Pear',
    checked: false,
  },
];
describe('CheckboxListComponent', () => {
  let element: CheckboxListComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-checkbox-list');
    expect(el).to.be.instanceof(CheckboxListComponent);
  });

  describe('checkbox list direction', () => {
    Object.values(Direction).forEach((direction) => {
      describe(`when direction is "${direction}"`, () => {
        beforeEach(async () => {
          element = await fixture(html` <oryx-checkbox-list
            direction="${direction}"
          ></oryx-checkbox-list>`);
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should reflect the direction attribute on the node', () => {
          expect(element?.getAttribute('direction')).to.equal(direction);
        });
      });
    });
  });

  describe('when a checkbox list with unselected checkboxes is toggled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkbox-list>
          ${groupData.map(
            (item) => html`
              <oryx-checkbox slot="inputs">
                <input type="checkbox" name="${item.label}"></input>
                ${item.label}
              </oryx-checkbox>
            `
          )}
        </oryx-checkbox-list>`
      );
      element.toggle();
    });

    it('should select all checkboxes', () => {
      expect(
        element.querySelectorAll('oryx-checkbox input:checked').length
      ).toBe(3);
    });
  });

  describe('when a checkbox list with selected checkboxes is toggled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkbox-list>
          ${groupData.map(
            (item) => html`
              <oryx-checkbox slot="inputs">
                <input type="checkbox" name="${item.label}" checked></input>
                ${item.label}
              </oryx-checkbox>
            `
          )}
        </oryx-checkbox-list>`
      );
      element.toggle();
    });

    it('should deselect all checkboxes', () => {
      expect(
        element.querySelectorAll('oryx-checkbox input:checked').length
      ).toBe(0);
    });
  });

  describe('when a checkbox list with partial selected checkboxes is toggled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkbox-list>
          ${groupData.map(
            (item) => html`
              <oryx-checkbox slot="inputs">
                <input type="checkbox" name="${item.label}" .checked=${item.checked}></input>
                ${item.label}
              </oryx-checkbox>
            `
          )}
        </oryx-checkbox-list>`
      );
      element.toggle();
    });

    it('should select all checkboxes', () => {
      expect(
        element.querySelectorAll('oryx-checkbox input:checked').length
      ).toBe(3);
    });
  });
});
