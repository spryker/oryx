import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Multi Range/Static`,
} as Meta;

const variants = [
  {
    title: 'Default options',
    min: 0,
    max: 100,
    minValue: 0,
    maxValue: 100,
    step: 1,
  },
  {
    title: 'Disabled',
    disabled: true,
    min: 0,
    max: 100,
    minValue: 10,
    maxValue: 90,
    step: 1,
  },
  {
    title: 'Custom range and values',
    min: 0,
    max: 20,
    minValue: 3,
    maxValue: 15,
    step: 1,
  },
];

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    ${variants.map((variant) => {
      return html` <section>
        <h4>${variant.title}</h4>
        <div>${multiRange(variant)}</div>
      </section>`;
    })}

    <style>
      section {
        padding: 10px;
      }
    </style>
  `;
};

const multiRange = (variant: any): TemplateResult => html`
  <oryx-multi-range
    .min="${variant.min}"
    .max="${variant.max}"
    .minValue="${variant.minValue}"
    .maxValue="${variant.maxValue}"
    .step="${variant.step}"
    ?disabled="${variant.disabled}"
  >
  </oryx-multi-range>
`;

export const States = Template.bind({});
