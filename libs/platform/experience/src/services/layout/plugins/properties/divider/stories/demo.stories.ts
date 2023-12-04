import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../../../.constants';
import { items } from './util';

export default {
  title: `${storybookPrefix}/Layout/Divider/Demo`,
  args: {
    divider: true,
    dividerInBetween: true,
    dividerBefore: false,
    dividerAfter: false,
    dividerColor: 'red',
    dividerWidth: '3px',
    dividerStyle: 'dotted',
  } as LayoutProperty,
  argTypes: {
    dividerStyle: {
      control: {
        type: 'select',
        options: [
          'solid',
          'dashed',
          'dotted',
          'double',
          'groove',
          'ridge',
          'inset',
          'outset',
          'none',
          'hidden',
        ],
      },
    },
  },
} as Meta;

const Template: Story<LayoutProperty> = (
  props: LayoutProperty
): TemplateResult => {
  const options = {
    rules: [{ layout: { type: 'carousel', ...props, divider: true } }],
  };
  return html`
    <oryx-layout .options=${options}> ${items(12)} </oryx-layout>

    <style>
      oryx-layout > * {
        background: var(--oryx-color-neutral-5);
        padding: 50px;
        text-align: center;
      }
    </style>
  `;
};

export const Demo = Template.bind({});
