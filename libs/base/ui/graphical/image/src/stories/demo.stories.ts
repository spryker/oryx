import { getAppGraphics } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

const graphics = getAppGraphics();

export default {
  title: `${storybookPrefix}/Graphical/Image`,
  args: {
    resource: graphics[0],
    fill: '',
  },
  argTypes: {
    resource: {
      options: graphics,
      control: { type: 'select' },
    },
    fill: {
      table: { category: 'demo' },
    },
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

const Template: Story = (props): TemplateResult => {
  return html`
    <oryx-image
      .resource=${props.resource}
      .style=${props.fill ? `--oryx-fill:${props.fill}` : undefined}
    ></oryx-image>
    <style>
      oryx-image {
        display: block;
        max-width: 300px;
        margin: auto;
      }
    </style>
  `;
};

export const Demo = Template.bind({});
