import { MockDateDecorator } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Search`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      disableSnapshot: true,
    },
  },
  decorators: [MockDateDecorator()],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-picking-search></oryx-picking-search>`;
};

export const Demo = Template.bind({});
