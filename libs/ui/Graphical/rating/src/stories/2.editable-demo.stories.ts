import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../utilities';
import '../index';
import { RatingProperties } from '../index';

export default {
  title: `${storybookPrefix}/Graphical/Rating`,
  args: {
    scale: 5,
    characters: '',
    size: Size.large,
  },
  argTypes: {
    size: {
      options: [Size.large, Size.small],
      control: { type: 'radio' },
    },
  },
} as Meta;

const Template: Story<RatingProperties> = (
  props: RatingProperties
): TemplateResult => {
  return html`
    <oryx-rating
      scale=${ifDefined(props.scale)}
      characters=${ifDefined(props.characters)}
      size=${ifDefined(props.size)}
      @input=${console.log}
    ></oryx-rating>
  `;
};

export const DemoEditable = Template.bind({});
