import { PaginationOptions } from '@spryker-oryx/search/pagination';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Pagination`,
  args: {
    max: 3,
    enableControls: true,
  },
} as unknown as Meta;

const Template: Story<PaginationOptions> = (
  options: PaginationOptions
): TemplateResult => {
  return html`<oryx-search-pagination
    .options=${options}
  ></oryx-search-pagination> `;
};

export const Demo = Template.bind({});
