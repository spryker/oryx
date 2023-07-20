import { getShadowElementBySelector } from '@/tools/testing';
import { fixture, html } from '@open-wc/testing-helpers';
import {
  a11yConfig,
  queryAssignedElements,
  useComponent,
} from '@spryker-oryx/utilities';
import { TypeaheadComponent } from './typeahead.component';
import { typeheadComponent } from './typeahead.def';

describe('TypeaheadComponent', () => {
  let element: TypeaheadComponent;

  beforeAll(async () => {
    await useComponent(typeheadComponent);
  });

  describe('empty', () => {
    describe('when the isEmpty is not set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead label="some label"><input /></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have an empty message', () => {
        expect(
          queryAssignedElements(element, { slot: 'empty', flatten: true })
            .length
        ).toBe(0);
      });
    });

    describe('when the isEmpty flag is set to true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead .isEmpty=${true} label="some label"
            ><input
          /></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should have an empty message', () => {
        expect(
          getShadowElementBySelector(
            element,
            'slot[name=empty] div.placeholder'
          )?.textContent
        ).toContain('No results found');
      });
    });

    describe('when an empty message is given', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead
            ?isEmpty=${true}
            .emptyMessage=${'EMPTY'}
            label="some label"
            ><input
          /></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should have an empty message', () => {
        expect(
          getShadowElementBySelector(
            element,
            'slot[name=empty] div.placeholder'
          )?.textContent
        ).toContain('EMPTY');
      });
    });

    describe('when the isEmpty is set to false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead ?isEmpty=${false} label="some label"
            ><input
          /></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have an empty message', () => {
        expect(
          queryAssignedElements(element, { slot: 'empty', flatten: true })
            .length
        ).toBe(0);
      });
    });
  });

  describe('loading', () => {
    describe('when the isLoading flag is not set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead label="some label"><input /></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have a loading spinner', () => {
        expect(
          getShadowElementBySelector(
            element,
            'slot[name=loading] div oryx-icon[type=loader]'
          )
        ).toBeNull();
      });
    });

    describe('when the isLoading flag is set to true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead ?isLoading=${true} label="some label"
            ><input
          /></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should have a loading spinner', () => {
        expect(
          getShadowElementBySelector(
            element,
            'slot[name=loading] div oryx-spinner'
          )
        ).not.toBeNull();
      });
    });

    describe('when the loading message is set to false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead ?isLoading=${false} label="some label"
            ><input
          /></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have a loading spinner', () => {
        expect(
          getShadowElementBySelector(
            element,
            'slot[name=loading] div oryx-icon[type=loader]'
          )
        ).toBeNull();
      });
    });
  });
});
