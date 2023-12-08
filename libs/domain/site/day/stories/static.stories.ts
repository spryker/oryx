import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/day`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-site-day day="monday"></oryx-site-day>
    <oryx-site-day .day=${'tuesday'}></oryx-site-day>
    <oryx-site-day day="wednesday"></oryx-site-day>
    <oryx-site-day day="thursday"></oryx-site-day>
    <oryx-site-day day="friday"></oryx-site-day>
    <oryx-site-day day="saturday"></oryx-site-day>
    <oryx-site-day day="sunday"></oryx-site-day>
    <h3>Inside token</h3>
    <oryx-site-day
      day="monday"
      .i18nToken=${'before-<day>-after'}
    ></oryx-site-day>

    <style>
      oryx-site-day {
        display: block;
      }
    </style>
  `;
};

export const Static = Template.bind({});
