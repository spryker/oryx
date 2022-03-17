import { expect, fixture, html } from '@open-wc/testing';
import { a11yConfig } from '../../a11y';
import { queryAssignedElements } from '../../utilities';
import './index';
import { TypeaheadComponent } from './typeahead.component';

describe('TypeaheadComponent', () => {
  let element: TypeaheadComponent;

  describe('empty', () => {
    describe('when the isEmpty is not set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead label="some label"></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have an empty message', () => {
        expect(
          queryAssignedElements(element, { slot: 'empty', flatten: true })
            .length
        ).to.eq(0);
      });
    });

    describe('when the isEmpty flag is set to true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead
            .isEmpty=${true}
            label="some label"
          ></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should have an empty message', () => {
        expect(
          element.shadowRoot?.querySelector('slot[name=empty] div.placeholder')
            ?.textContent
        ).to.contain('No results found');
      });
    });

    describe('when an empty message is given', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead
            ?isEmpty=${true}
            .emptyMessage=${'EMPTY'}
            label="some label"
          ></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should have an empty message', () => {
        expect(
          element.shadowRoot?.querySelector('slot[name=empty] div.placeholder')
            ?.textContent
        ).to.contain('EMPTY');
      });
    });

    describe('when the isEmpty is set to false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead
            ?isEmpty=${false}
            label="some label"
          ></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have an empty message', () => {
        expect(
          queryAssignedElements(element, { slot: 'empty', flatten: true })
            .length
        ).to.eq(0);
      });
    });
  });

  describe('loading', () => {
    describe('when the isLoading flag is not set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead label="some label"></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have a loading spinner', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=loading] div oryx-icon[type=loader]'
          )
        ).to.not.exist;
      });
    });

    describe('when the isLoading flag is set to true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead
            ?isLoading=${true}
            label="some label"
          ></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should have a loading spinner', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=loading] div oryx-icon[type=loader]'
          )
        ).to.exist;
      });
    });

    describe('when the loading message is set to false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-typeahead
            ?isLoading=${false}
            label="some label"
          ></oryx-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have a loading spinner', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=loading] div oryx-icon[type=loader]'
          )
        ).to.not.exist;
      });
    });
  });
});
