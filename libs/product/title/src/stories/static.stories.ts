import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Title/Static`,
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <h3>No truncation</h3>
    <div>
      ${Array.from(Array(6).keys()).map(
        (i) =>
          html`
            <product-title
              sku="1"
              .options=${{ tag: 'h' + (i + 1) }}
            ></product-title>
          `
      )}
    </div>

    <h3>Limited space</h3>
    <div style="width:100px">
      ${Array.from(Array(6).keys()).map(
        (i) =>
          html`
            <product-title
              sku="1"
              .options=${{ tag: 'h' + (i + 1) }}
            ></product-title>
          `
      )}
    </div>

    <h3>Truncated</h3>
    <div style="width:100px">
      ${Array.from(Array(6).keys()).map(
        (i) =>
          html`
            <product-title
              sku="1"
              .options=${{ tag: 'h' + (i + 1), maxLines: 1 }}
            ></product-title>
          `
      )}
    </div>`;
};

export const Variations = Template.bind({});
