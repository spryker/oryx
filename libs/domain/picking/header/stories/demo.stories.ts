import { storybookDefaultViewports } from '@/tools/storybook';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Header`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
};

const Template: Story = (): TemplateResult => {
  return html`<oryx-picking-header></oryx-picking-header>`;
};

export const Demo = Template.bind({});
