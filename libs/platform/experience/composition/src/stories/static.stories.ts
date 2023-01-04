import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constants';
import { demoStyles, elements } from './utils';

export default {
  title: `${storybookPrefix}/Composition/Layout/Static`,
  parameters: {
    chromatic: { delay: 300 },
  },
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const gen = (layout: string, colCount = 4): TemplateResult => html`
    <h3>${layout} (${colCount})</h3>
    <experience-composition
      style="--oryx-layout-item-count:${colCount};"
      class="layout-${layout}"
    >
      ${elements(colCount * 2 + 1)}
    </experience-composition>
  `;

  return html`
    <div>
      <h2>Four columns</h2>
      ${gen('grid', 4)} ${gen('carousel', 4)} ${gen('column', 4)}

      <h2>Two columns</h2>
      ${gen('grid', 2)} ${gen('carousel', 2)} ${gen('column', 2)}

      <h2>One column</h2>
      ${gen('grid', 1)} ${gen('carousel', 1)} ${gen('column', 1)}
    </div>

    ${demoStyles}
    <style>
      experience-composition {
        --oryx-layout-height: 100px;
        --oryx-layout-gap: 5px;
      }

      experience-composition div:nth-child(2) {
        --oryx-layout-margin: 30px;
        border: solid 5px var(--oryx-color-ink);
      }

      experience-composition div:nth-child(3) {
        --oryx-layout-span: 2;
      }

      experience-composition div:nth-child(3) .content {
        background-color: var(--oryx-color-primary-300);
      }
    </style>
  `;
};

export const StaticLayout = Template.bind({});
