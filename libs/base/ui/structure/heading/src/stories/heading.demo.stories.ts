import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import { HeadingAttributes } from '../heading.model';

const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'caption', 'subtitle'];

export default {
  title: `${storybookPrefix}/Structure/Heading`,
  args: {
    tag: 'h1',
  },
  argTypes: {
    tag: {
      control: { type: 'select' },
      options: tags,
    },
    maxLines: {
      control: { type: 'number' },
    },
    as: {
      control: { type: 'select' },
      options: tags,
    },
    asLg: {
      control: { type: 'select' },
      options: tags,
    },
    asMd: {
      control: { type: 'select' },
      options: tags,
    },
    asSm: {
      control: { type: 'select' },
      options: tags,
    },
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

const Template: Story<HeadingAttributes> = (
  props: HeadingAttributes
): TemplateResult => {
  return html`<oryx-heading
    tag=${ifDefined(props.tag)}
    as=${ifDefined(props.as)}
    as-lg=${ifDefined(props.asLg)}
    as-md=${ifDefined(props.asMd)}
    as-sm=${ifDefined(props.asSm)}
    maxLines=${ifDefined(props.maxLines)}
  >
    Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy
    wizards make toxic brew.
  </oryx-heading>`;
};

export const Demo = Template.bind({});
