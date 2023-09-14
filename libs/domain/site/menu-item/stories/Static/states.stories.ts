import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Menu Item/Static`,
} as Meta;

const renderTemplate = (url = '/'): TemplateResult => html`<oryx-site-menu-item
  .options=${{ icon: IconTypes.Description, url }}
  .content=${{ text: 'item' }}
></oryx-site-menu-item>`;

const Template: Story = (): TemplateResult => html`<h4>States</h4>
  <h4>Active</h4>
  ${renderTemplate()}
  <h4>Hover</h4>
  <div class="pseudo-hover">${renderTemplate('/mock')}</div>
  <h4>Inactive</h4>
  ${renderTemplate('/mock')}`;

export const States = Template.bind({});
