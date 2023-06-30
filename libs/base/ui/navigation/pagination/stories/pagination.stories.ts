import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { PaginationProperties } from '../pagination.model';

export default {
  title: `${storybookPrefix}/Navigations/Pagination`,
  args: {
    enableNavigation: true,
    current: 1,
    max: 5,
    size: 10,
  },
  argTypes: {
    size: {
      control: { type: 'number', max: 100 },
    },
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

interface Props extends PaginationProperties {
  size: number;
}

const Template: Story<Props> = ({
  enableNavigation,
  current,
  max,
  size,
}: Props): TemplateResult => {
  if (size > 100) {
    alert('we support a size of max 100 pages');
    size = 100;
  }
  return html`
    <oryx-pagination
      ?enableNavigation=${enableNavigation}
      current=${current}
      max=${max}
    >
      ${Array.from(new Array(size).keys()).map((key) => {
        return html`<a
          href="/?path=/story/ui-navigations-pagination--pagination-demo&args=current:${key +
          1};enableNavigation:${enableNavigation};max:${max};size:${size}"
          >${key + 1}</a
        >`;
      })}
    </oryx-pagination>
  `;
};

export const PaginationDemo = Template.bind({});
