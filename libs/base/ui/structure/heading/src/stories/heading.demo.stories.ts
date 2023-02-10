import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { HeadingAttributes } from '../heading.model';

export default {
  title: `${storybookPrefix}/Structure/Heading`,
  args: {
    tag: 'h1',
  },
  argTypes: {
    tag: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'caption', 'subtitle'],
      control: { type: 'select' },
    },
    maxLines: {
      control: { type: 'number' },
    },
    appearance: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'caption', 'subtitle'],
      control: { type: 'select' },
    },
    mdAppearance: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'caption', 'subtitle'],
      control: { type: 'select' },
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
    .maxLines=${props.maxLines}
  >
    Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy
    wizards make toxic brew.
  </oryx-heading>`;
};

export const Demo = Template.bind({});
