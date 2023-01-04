import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Average rating/Static`,
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <div style="display: flex;">
    <div class="visible" style="margin-right: 100px">
      <p>Hidden review count</p>
      ${Array.from(Array(5).keys()).map(
        (i) =>
          html` <product-average-rating
            sku=${i + 1}
            .options=${{ hideReviewCount: true }}
          />`
      )}
    </div>
    <div class="hidden">
      <p>Visible review Count</p>
      ${Array.from(Array(5).keys()).map(
        (i) =>
          html` <product-average-rating
            sku=${i + 1}
            .options=${{ hideReviewCount: false }}
          />`
      )}
    </div>
  </div>`;
};

export const ReviewCount = Template.bind({});
