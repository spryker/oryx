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
  }
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-picking-lists-header></oryx-picking-lists-header>
  `;
};

export const Demo = Template.bind({});
