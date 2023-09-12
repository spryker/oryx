import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Breadcrumb/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Default</h3>
    <oryx-site-breadcrumb></oryx-site-breadcrumb>

    <h3>Custom divider's icon</h3>
    <oryx-site-breadcrumb
      .options=${{ divider: IconTypes.Add }}
    ></oryx-site-breadcrumb>

    <h3>Without dividers</h3>
    <oryx-site-breadcrumb .options=${{ divider: '' }}></oryx-site-breadcrumb>
  `;
};

export const Variants = Template.bind({});
