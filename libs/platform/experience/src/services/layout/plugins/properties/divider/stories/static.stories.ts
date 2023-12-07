import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../../../.constants';
import { items } from './util';

export default {
  title: `${storybookPrefix}/Layout/Divider`,
} as Meta;

const Template: Story<LayoutProperty> = (
  props: LayoutProperty
): TemplateResult => {
  return html`
    <h2>In between divider</h2>
    <h3>Horizontal</h3>
    <oryx-layout
      .options=${{
        rules: [{ layout: { type: 'flex', divider: true, ...props } }],
      }}
    >
      ${items(3)}
    </oryx-layout>

    <h3>Vertical (dotted / red / 3px)</h3>
    <oryx-layout
      .options=${{
        rules: [
          {
            layout: {
              type: 'flex',
              vertical: true,
              divider: true,
              dividerColor: 'red',
              dividerStyle: 'dotted',
              dividerWidth: '3px',
              ...props,
            },
          },
        ],
      }}
    >
      ${items(3)}
    </oryx-layout>

    <h2>Before divider</h2>

    <h3>Horizontal (blue/10px)</h3>
    <oryx-layout
      .options=${{
        rules: [
          {
            layout: {
              type: 'flex',
              divider: true,
              dividerInBetween: false,
              dividerBefore: true,
              dividerColor: 'blue',
              dividerWidth: '10px',
              ...props,
            },
          },
        ],
      }}
    >
      ${items(3)}
    </oryx-layout>

    <h3>Vertical (dotted/yellow/3px)</h3>
    <oryx-layout
      .options=${{
        rules: [
          {
            layout: {
              type: 'flex',
              vertical: true,
              divider: true,
              dividerInBetween: false,
              dividerBefore: true,
              dividerStyle: 'dotted',
              dividerColor: 'yellow',
              dividerWidth: '3px',
              ...props,
            },
          },
        ],
      }}
    >
      ${items(3)}
    </oryx-layout>

    <h2>After divider</h2>

    <h3>Horizontal (centered / blue)</h3>
    <oryx-layout
      .options=${{
        rules: [
          {
            layout: {
              type: 'flex',
              divider: true,
              dividerInBetween: false,
              dividerAfter: true,
              dividerColor: 'blue',
              ...props,
            },
            justify: 'center',
          },
        ],
      }}
    >
      ${items(3)}
    </oryx-layout>

    <h3>Vertical (blue / padding / yellow)</h3>
    <oryx-layout
      .options=${{
        rules: [
          {
            padding: '20px',
            layout: {
              type: 'flex',
              vertical: true,
              divider: true,
              dividerInBetween: false,
              dividerAfter: true,
              dividerColor: 'yellow',
              ...props,
            },
          },
        ],
      }}
    >
      ${items(3)}
    </oryx-layout>

    <style>
      oryx-layout > * {
        background: var(--oryx-color-neutral-5);
        padding: 20px 50px;
        text-align: center;
      }
    </style>
  `;
};

export const Static = Template.bind({});
