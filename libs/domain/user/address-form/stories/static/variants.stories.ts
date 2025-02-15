import { mockCurrentAddress } from '@spryker-oryx/user/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Address Form/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <div style="--oryx-column-grid: 2">
      <h4>DE form</h4>
      <oryx-user-address-form></oryx-user-address-form>

      <h4>US form</h4>
      <oryx-user-address-form country="US"></oryx-user-address-form>

      <h4>With values and defaults</h4>
      <oryx-user-address-form
        .values=${mockCurrentAddress}
        enableDefaultShipping
        enableDefaultBilling
      ></oryx-user-address-form>
    </div>
  `;
};

export const Variants = Template.bind({});
