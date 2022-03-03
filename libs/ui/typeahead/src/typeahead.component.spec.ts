import { queryAssignedElements } from '../../utilities';
import './index';
import { TypeaheadComponent } from './typeahead.component';
import { expect, fixture, html } from '@open-wc/testing';

describe('TypeaheadComponent', () => {
  let element: TypeaheadComponent;

  describe('empty', () => {
    describe('when the isEmpty is not set', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-typeahead></oryx-typeahead>`);
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
          html`<oryx-typeahead .options=${{ isEmpty: true }}></oryx-typeahead>`
        );
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
            .options=${{ isEmpty: true, emptyMessage: 'EMPTY' }}
          ></oryx-typeahead>`
        );
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
          html`<oryx-typeahead .options=${{ isEmpty: false }}></oryx-typeahead>`
        );
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
        element = await fixture(html`<oryx-typeahead></oryx-typeahead>`);
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
            .options=${{ isLoading: true }}
          ></oryx-typeahead>`
        );
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
            .options=${{ isLoading: false }}
          ></oryx-typeahead>`
        );
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
