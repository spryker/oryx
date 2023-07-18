import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Header`,
};

const Template: Story = (): TemplateResult => {
  return html`<oryx-header></oryx-header>`;
};

export const Demo = Template.bind({});
