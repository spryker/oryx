import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Breadcrumbs/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Default</h3>
    <oryx-site-breadcrumbs></oryx-site-breadcrumbs>

    <h3>Custom divider's icon</h3>
    <oryx-site-breadcrumbs
      .options=${{ dividerIcon: IconTypes.Add }}
    ></oryx-site-breadcrumbs>

    <h3>Without dividers</h3>
    <oryx-site-breadcrumbs
      .options=${{ showDivider: false }}
    ></oryx-site-breadcrumbs>
  `;
};

export const Variants = Template.bind({});
