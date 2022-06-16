import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';
import { setupProductMocks } from '../../../../src/mocks';

export default {
  title: `${storybookPrefix}/Average rating/Static`,
  loaders: [setupProductMocks],
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <div style="display: flex;">
    <div class="visible" style="margin-right: 100px">
      <p>Visible review Count</p>
      ${Array.from(Array(5).keys()).map(
        (i) =>
          html` <product-average-rating
            sku=${i + 1}
            .content=${{ hideReviewCount: true }}
          />`
      )}
    </div>
    <div class="hidden">
      <p>Hidden review count</p>
      ${Array.from(Array(5).keys()).map(
        (i) =>
          html` <product-average-rating
            sku=${i + 1}
            .content=${{ hideReviewCount: false }}
          />`
      )}
    </div>
  </div>`;
};

export const ReviewCount = Template.bind({});
