import { HeadingTag } from '@spryker-oryx/ui/heading';
import { Meta, Story } from '@storybook/web-components';

import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Title/Static`,
} as unknown as Meta;

const template = (sku = '1', link = false, maxLines?: number) =>
  html`
    ${Array.from(Array(6).keys()).map(
      (i) =>
        html`
          <product-title
            .sku=${sku}
            .options=${{ tag: 'h' + (i + 1), link, maxLines }}
          ></product-title>
        `
    )}

    <product-title
      .sku=${sku}
      .options=${{ tag: HeadingTag.Subtitle, link, maxLines }}
    ></product-title>

    <product-title .sku=${sku} .options=${{ link, maxLines }}></product-title>
  `;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <section>
      <h4>Type</h4>
      <h4>Heading</h4>
      <h4>With link</h4>

      <p>No truncation</p>
      <div>${template()}</div>
      <div>${template('1', true)}</div>

      ${[1, 2, 3].map(
        (max) => html`
          <p>Max lines (${max}) by property</p>
          <div>${template('6', false, max)}</div>
          <div>${template('6', true, max)}</div>
        `
      )}
      ${[1, 2, 3].map(
        (max) => html`
          <p>Max lines (${max}) by CSS</p>
          <div style="--max-lines: ${max}">${template('6')}</div>
          <div style="--max-lines: ${max}">${template('6', true)}</div>
        `
      )}
    </section>
    <style>
      section {
        display: grid;
        grid-template-columns: max-content 250px 250px;
        gap: 10px 30px;
      }
    </style>
  `;
};

export const Variations = Template.bind({});
