import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Navigations/Pagination/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
      (i) => html`
        <div class="row">
          <oryx-pagination
            current=${i + 1}
            max="1"
            enableNavigation
            @click=${(e: PointerEvent): void => e.preventDefault()}
          >
            ${Array.from(new Array(10).keys()).map((key) => {
              return html`<a>${key + 1}</a>`;
            })}
          </oryx-pagination>
        </div>
      `
    )}
    <style>
      .row {
        margin-bottom: 10px;
      }
    </style>
  `;
};

export const PaginationMaxOne = Template.bind({});
