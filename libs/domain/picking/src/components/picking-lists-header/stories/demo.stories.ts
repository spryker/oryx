import { MockDateDecorator } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Picking List Header`,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      disableSnapshot: true,
    },
  },
  decorators: [MockDateDecorator(new Date('March 20, 2020 20:00:00'))],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <oryx-picking-lists-header></oryx-picking-lists-header> `;
};

export const Demo = Template.bind({});
