import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Navigate Back`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-navigate-back></oryx-navigate-back>`;
};

export const Demo = Template.bind({});