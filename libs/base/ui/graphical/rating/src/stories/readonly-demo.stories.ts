import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import { RatingProperties } from '../rating.model';

export default {
  title: `${storybookPrefix}/Graphical/Rating`,
  args: {
    value: 2.5,
    scale: 5,
    size: Size.Lg,
    reviewCount: '173',
  },
  argTypes: {
    size: {
      options: [Size.Lg, Size.Sm],
      control: { type: 'radio' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
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
