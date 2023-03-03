import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import { Size } from '../../../../src/utilities';
import { RatingProperties } from '../rating.model';

export default {
  title: `${storybookPrefix}/Graphical/Rating`,
  args: {
    value: 2.5,
    scale: 5,
    size: Size.Large,
    reviewCount: '173',
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
      readonly
      value=${ifDefined(props.value)}
      scale=${ifDefined(props.scale)}
      size=${ifDefined(props.size)}
      reviewCount=${ifDefined(props.reviewCount)}
    ></oryx-rating>
  `;
};

export const ReadonlyDemo = Template.bind({});
