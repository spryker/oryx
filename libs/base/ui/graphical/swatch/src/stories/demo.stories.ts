import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { SwatchAttributes } from '../swatch.model';

export default {
  title: `${storybookPrefix}/Graphical/Swatch`,
  args: {
    color: 'red',
  },
  argTypes: {
    color: {
      control: { type: 'color' },
    },
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
};

const Template: Story<SwatchAttributes> = (
  props: SwatchAttributes
): TemplateResult => {
  return html` <oryx-swatch .color=${props.color}></oryx-swatch> `;
};

export const Demo = Template.bind({});
