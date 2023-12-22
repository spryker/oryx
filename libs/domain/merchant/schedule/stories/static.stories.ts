import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { MERCHANT } from '@spryker-oryx/merchant';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Schedule`,
  args: {},
  argTypes: {},
  parameters: { chromatic: { disableSnapshot: true } },
};

const Template: Story = (): TemplateResult => {
  resolve(ContextService).provide(document.body, MERCHANT, { id: '1' });
  return html` <oryx-merchant-schedule></oryx-merchant-schedule> `;
};

export const Static = Template.bind({});
