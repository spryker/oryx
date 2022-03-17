import { Meta, Story } from '@storybook/web-components';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { storybookPrefix } from '../../../constant';
import '../../../popover/index';
import { SearchEvent } from '../../../search';
import '../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead`,
} as Meta;
class SearchComponent extends LitElement {
  @state()
  options?: string[];

  @state() isLoading = false;

  protected list = ['aaa', 'bbb', 'ccc', 'abc', 'eee', 'efg', 'alternative'];

  protected typeahead(ev: CustomEvent<SearchEvent>): void {
    this.isLoading = true;
    window.setTimeout(() => {
      if (!ev.detail.query || ev.detail.query === '') {
        this.options = undefined;
      } else {
        this.options = this.list.filter(
          (item) => ev.detail.query && item.indexOf(ev.detail.query) > -1
        );
      }
      console.log('search', ev.detail.query, this.options);
      this.isLoading = false;
    }, (Math.floor(Math.random() * 3) + 1) * 100);
  }

  render(): TemplateResult {
    return html`
      <oryx-typeahead
        style="width:500px"
        label="label"
        ?isLoading=${this.isLoading}
        ?emptyOption=${this.options?.length === 0}
        @oryx.typeahead=${this.typeahead}
      >
        <input placeholder="Start typing..." />
        ${map(
          this.options,
          (i) => html`<oryx-option slot="option"> ${i} </oryx-option>`
        )}
      </oryx-typeahead>
    `;
  }
}
customElements.define('demo-typeahead', SearchComponent);

const Template: Story<unknown> = (): TemplateResult => {
  const logSelect = (ev: CustomEvent<SearchEvent>): void => {
    console.log('oryx.select event', ev.detail.query);
  };
  const logSearch = (ev: CustomEvent<SearchEvent>): void => {
    console.log('oryx.search event', ev.detail.query);
  };
  return html`<demo-typeahead
    @oryx.select=${logSelect}
    @oryx.search=${logSearch}
  ></demo-typeahead>`;
};

export const TypeaheadDemo = Template.bind({});
