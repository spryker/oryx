import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Actions/Dropdown Item/Static`,
} as Meta;

const renderTemplate = (): TemplateResult =>
  html`<oryx-dropdown-item
    .icon=${IconTypes.User}
    text="item"
  ></oryx-dropdown-item>`;

const Template: Story = (): TemplateResult => html`<h4>States</h4>
  <h4>Active</h4>
  ${renderTemplate()}
  <h4>Hover</h4>
  <div class="pseudo-hover">${renderTemplate()}</div>`;

export const States = Template.bind({});
