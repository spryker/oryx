import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Title/Static`,
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <style>
      product-title {
        --line-clamp: 1;
      }
    </style>

    <div style="width:50px">
      ${Array.from(Array(6).keys()).map(
        (i) =>
          html`
            <product-title
              sku="1"
              .options=${{ tag: 'h' + (i + 1), truncateAfter: 1 }}
            ></product-title>
          `
      )}
    </div>`;
};

export const Truncated = Template.bind({});
