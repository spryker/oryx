import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { a11yConfig } from '@spryker-oryx/utilities';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchIconPosition,
} from '../../../search/searchbox';
import { getControl } from '../../utilities/getControl';
import { SelectComponent } from './select.component';
import { selectComponent } from './select.def';

describe('SelectComponent', () => {
  let element: SelectComponent;

  beforeAll(async () => {
    await useComponent(selectComponent);
  });

  describe('when the value is set', () => {
    describe('and the value is new', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-select>
            <select @change=${callback}>
              <option value="foo"></option>
              <option value="bar"></option>
            </select>
          </oryx-select>`
        );
        element.setValue('bar');
      });

      it('should set the value of the underlying select', () => {
        const select = element.querySelector('select');
        expect(select?.value).toBe('bar');
      });

      it('should dispatch a change event', () => {
        expect(callback).toHaveBeenCalled();
      });
    });

    describe('and the value will not new', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        element = await fixture(
          html`<oryx-select>
            <select @change=${callback}>
              <option value="foo"></option>
              <option value="bar"></option>
            </select>
          </oryx-select>`
        );
        element.setValue('foo');
      });

      it('should not keep the value of the underlying select', () => {
        const select = element.querySelector('select');
        expect(select?.value).toBe('foo');
      });

      it('should dispatch a change event', () => {
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('options', () => {
    const expectOptions = (
      suffixIcon: string,
      searchIconPosition: SearchIconPosition,
      clearIconPosition: ClearIconPosition,
      clearIconAppearance: ClearIconAppearance
    ): void => {
      it('should have default suffixIcon', () => {
        expect(element.suffixIcon).toBe(suffixIcon);
      });

      it('should have default searchIconPosition', () => {
        expect(element.searchIconPosition).toBe(searchIconPosition);
      });

      it('should have default clearIconPosition', () => {
        expect(element.clearIconPosition).toBe(clearIconPosition);
      });

      it('should have default clearIconAppearance', () => {
        expect(element.clearIconAppearance).toBe(clearIconAppearance);
      });
    };

    describe('when created without control', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-select label="some label"><input /></oryx-select>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      expectOptions(
        IconTypes.Dropdown,
        SearchIconPosition.None,
        ClearIconPosition.Suffix,
        ClearIconAppearance.Hover
      );
    });

    describe('when created with an <input /> control', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-select label="some label"><input /></oryx-select>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      expectOptions(
        IconTypes.Dropdown,
        SearchIconPosition.None,
        ClearIconPosition.Suffix,
        ClearIconAppearance.Hover
      );
    });

    describe('when created with an <input /> control with empty values allowed', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-select label="some label">
            <input />
            <oryx-option hidden></oryx-option>
            <oryx-option>first</oryx-option>
            <oryx-option>second</oryx-option>
          </oryx-select>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      expectOptions(
        IconTypes.Dropdown,
        SearchIconPosition.None,
        ClearIconPosition.Suffix,
        ClearIconAppearance.Hover
      );
    });

    describe('when created with an <input /> control with empty values not allowed', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-select label="some label">
            <input />
          </oryx-select>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      expectOptions(
        IconTypes.Dropdown,
        SearchIconPosition.None,
        ClearIconPosition.Suffix,
        ClearIconAppearance.Hover
      );
    });

    describe('when created with a <select> control', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-select label="some label"><select></select></oryx-select>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      expectOptions(
        IconTypes.Dropdown,
        SearchIconPosition.None,
        ClearIconPosition.None,
        ClearIconAppearance.Hover
      );
    });
  });

  describe('focus', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-select><input value="foo" /></oryx-select>`
      );
    });

    describe('when the focusin event is dispatched', () => {
      beforeEach(() => {
        getControl(element).dispatchEvent(
          new Event('focusin', { bubbles: true })
        );
      });
      it('should not show the options', () => {
        expect(
          element.renderRoot.querySelector('oryx-popover')?.hasAttribute('show')
        ).toBe(false);
      });
    });
  });
});
