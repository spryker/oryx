import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.storybook/constant';
import { Size } from '../../../../utilities';
import '../index';
import { RatingProperties } from '../index';

export default { title: `${storybookPrefix}/Graphical/Rating` } as Meta;

const Template: Story<RatingProperties> = (
  props: RatingProperties
): TemplateResult => {
  return html`
    <oryx-rating
      ?readonly=${props.readonly}
      value=${ifDefined(props.value)}
      scale=${ifDefined(props.scale)}
      characters=${ifDefined(props.characters)}
      size=${ifDefined(props.size)}
      reviewCount=${ifDefined(props.reviewCount)}
      @submit=${console.log}
    ></oryx-rating>
  `;
};

export const RatingDemo = Template.bind({});

RatingDemo.args = {
  readonly: true,
  value: 2.5,
  scale: 5,
  characters: '',
  size: Size.large,
  reviewCount: '',
};

RatingDemo.argTypes = {
  size: {
    options: [Size.large, Size.small],
    control: { type: 'radio' },
  },
};
