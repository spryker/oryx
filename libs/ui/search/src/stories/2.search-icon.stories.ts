import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../index';

export default {
  title: `${storybookPrefix}/Search/SearchBox`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <div style="width:300px">
      <oryx-search label="search" .options=${{ searchIcon: 'close' }}>
        <input placeholder="Search..." />
      </oryx-search>
    </div>
  `;
};
export const SearchIcon = Template.bind({});
