import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import {
  HeadingAttributes,
  HeadingTag,
  HeadingVisibility,
} from '../heading.model';

const tags = [
  HeadingTag.H1,
  HeadingTag.H2,
  HeadingTag.H3,
  HeadingTag.H4,
  HeadingTag.H5,
  HeadingTag.H6,
  HeadingTag.Caption,
  HeadingTag.Subtitle,
  HeadingTag.Small,
  HeadingTag.Strong,
  HeadingVisibility.None,
];

export default {
  title: `${storybookPrefix}/Structure/Heading`,
  args: { tag: 'h1' },
  argTypes: {
    tag: {
      control: { type: 'select' },
      options: tags,
    },
    maxLines: {
      control: { type: 'number' },
    },
    typography: {
      control: { type: 'select' },
      options: tags,
    },
    lg: {
      control: { type: 'select' },
      options: tags,
    },
    md: {
      control: { type: 'select' },
      options: tags,
    },
    sm: {
      control: { type: 'select' },
      options: tags,
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story<HeadingAttributes> = (
  props: HeadingAttributes
): TemplateResult => {
  return html`<oryx-heading
    tag=${ifDefined(props.tag)}
    typography=${ifDefined(props.typography)}
    lg=${ifDefined(props.lg)}
    md=${ifDefined(props.md)}
    sm=${ifDefined(props.sm)}
    maxLines=${ifDefined(props.maxLines)}
  >
    Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy
    wizards make toxic brew.
  </oryx-heading>`;
};

export const Demo = Template.bind({});
