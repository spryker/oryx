import {
  CompositionLayout,
  CompositionProperties,
  StyleRuleSet,
} from '@spryker-oryx/experience';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

const demoTable = { category: 'Demo' };
const nestedDemoTable = { category: '(sub) layout' };
export default {
  title: `${storybookPrefix}/Layout`,
  args: {
    mainLayout: 'grid',
    layout: 'grid',
    background: 'deeppink',
    gridColumn: 1,
    gridRow: 1,
    colSpan: 1,
    rowSpan: 1,
    padding: '0',
  },
  argTypes: {
    mainLayout: {
      options: ['list', 'column', 'split-column', 'carousel', 'grid', 'flex'],
      control: { type: 'select' },
      table: demoTable,
    },
    layout: {
      options: ['list', 'column', 'split-column', 'carousel', 'grid', 'flex'],
      control: { type: 'select' },
    },
    background: {
      control: { type: 'color' },
      table: nestedDemoTable,
    },
    gridColumn: {
      control: { type: 'number' },
      table: nestedDemoTable,
    },
    colSpan: {
      control: { type: 'number' },
      table: nestedDemoTable,
    },
    gridRow: {
      control: { type: 'number' },
      table: nestedDemoTable,
    },
    rowSpan: {
      control: { type: 'number' },
      table: nestedDemoTable,
    },
    padding: {
      control: { type: 'text' },
      table: nestedDemoTable,
    },
    gap: {
      control: { type: 'text' },
      table: nestedDemoTable,
    },
    align: {
      options: [
        'start',
        'stretch',
        'end',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
      ],
      control: { type: 'select' },
      table: nestedDemoTable,
    },
    rotate: {
      control: { type: 'number' },
      table: nestedDemoTable,
    },
    sticky: {
      control: { type: 'boolean' },
      table: nestedDemoTable,
    },
  },
} as Meta;

interface DemoProps {
  mainLayout?: CompositionLayout;
}

const Template: Story<DemoProps & StyleRuleSet> = (
  props: DemoProps & StyleRuleSet
): TemplateResult => {
  const innerOptions: CompositionProperties = {
    rules: [props],
  };
  return html`
    <oryx-layout .layout=${props.mainLayout} class="outer">
      ${Array.from({ length: 12 }, (_, i) => {
        const item = (id: number, postfix?: string) =>
          html`<div id="item-${id}">${id}${postfix}</div>`;
        if (i === 0) {
          return html`
            <oryx-layout
              uid="item-${i + 1}"
              .layout=${props.layout}
              ?layout-sticky=${props.sticky}
              ?layout-bleed=${props.bleed}
              .options=${innerOptions}
            >
              ${Array.from({ length: 8 }, (_, j) => item(j + 1, ` (n)`))}
            </oryx-layout>
          `;
        } else {
          return item(i + 1);
        }
      })}
    </oryx-layout>

    <style>
      oryx-layout > * {
        outline: solid 1px;
      }
      oryx-layout.outer > * {
        height: 200px;
      }
    </style>
  `;
};

export const Demo = Template.bind({});
