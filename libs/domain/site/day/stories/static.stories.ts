import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/day`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-day day="monday"></oryx-day>
    <oryx-day .day=${'tuesday'}></oryx-day>
    <oryx-day day="wednesday"></oryx-day>
    <oryx-day day="thursday"></oryx-day>
    <oryx-day day="friday"></oryx-day>
    <oryx-day day="saturday"></oryx-day>
    <oryx-day day="sunday"></oryx-day>
    <h3>Inside token</h3>
    <oryx-day day="monday" .i18nToken=${'before-<day>-after'}></oryx-day>

    <style>
      oryx-day {
        display: block;
      }
    </style>
  `;
};

export const Static = Template.bind({});
