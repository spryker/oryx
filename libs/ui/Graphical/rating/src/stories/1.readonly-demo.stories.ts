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
    value: 2.5,
    scale: 5,
    size: Size.large,
    reviewCount: '173',
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
      readonly
      value=${ifDefined(props.value)}
      scale=${ifDefined(props.scale)}
      size=${ifDefined(props.size)}
      reviewCount=${ifDefined(props.reviewCount)}
    ></oryx-rating>
  `;
};

export const DemoReadonly = Template.bind({});
