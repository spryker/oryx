import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { logo } from '../index';

useComponent(logo);

export default {
  title: `${storybookPrefix}/Logo`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-lp-logo></oryx-lp-logo>`;
};
export const Demo = Template.bind({});
