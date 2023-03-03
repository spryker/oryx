import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../src/utilities';
import { RatingProperties } from '../rating.model';

export default {
  title: `${storybookPrefix}/Graphical/Rating`,
  args: {
    scale: 5,
    characters: '',
    size: Size.Large,
  },
  argTypes: {
    size: {
      options: [Size.Large, Size.Small],
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

export const EditableDemo = Template.bind({});
