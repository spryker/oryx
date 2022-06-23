import { PaginationProperties } from '@spryker-oryx/ui/pagination';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import '../index';

export default {
  title: `${storybookPrefix}/Navigations/Pagination`,
} as Meta;

interface Props extends PaginationProperties {
  size: number;
}

const Template: Story<Props> = ({
  hideNavigation,
  current,
  max,
  size,
}: Props): TemplateResult => {
  return html`
    <oryx-pagination
      ?hideNavigation=${hideNavigation}
      current=${current}
      max=${max}
    >
      ${Array.from(new Array(size).keys()).map((key) => {
        return html`<a
          href="${window.location.search.split('&')[0]}&args=current:${key +
          1};"
          >${key + 1}</a
        >`;
      })}
    </oryx-pagination>
  `;
};
export const PaginationDemo = Template.bind({});
PaginationDemo.args = {
  hideNavigation: false,
  current: 1,
  max: 5,
  size: 10,
};
