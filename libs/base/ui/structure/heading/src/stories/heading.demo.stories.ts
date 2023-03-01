import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
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
    appearance: {
      control: { type: 'select' },
      options: tags,
    },
    mdAppearance: {
      control: { type: 'select' },
      options: tags,
    },
    smAppearance: {
      control: { type: 'select' },
      options: tags,
    },
  },
} as Meta;

const Template: Story<HeadingAttributes> = (
  props: HeadingAttributes
): TemplateResult => {
  return html`<oryx-heading
    .tag=${props.tag}
    .appearance=${props.appearance}
    .mdAppearance=${props.mdAppearance}
    .smAppearance=${props.smAppearance}
    .maxLines=${props.maxLines}
  >
    Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy
    wizards make toxic brew.
  </oryx-heading>`;
};

export const Demo = Template.bind({});
