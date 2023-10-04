import { MockDateDecorator } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/List header`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      disableSnapshot: true,
    },
  },
  decorators: [MockDateDecorator()],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-picking-lists-header></oryx-picking-lists-header>`;
};

export const Demo = Template.bind({});
