import { StyleRuleSet } from '@spryker-oryx/experience';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constants';

export default {
  title: `${storybookPrefix}/Layout`,
  args: {
    layout: 'grid',
    demoItemCount: 12,
    customItem: 1,
    customItemCount: 1,
    gap: '5px',
    sticky: false,
    background: 'lightgrey',
    marginInline: '0',
    marginBlock: '0',
    paddingInline: '0',
    paddingBlock: '0',
  },
  argTypes: {
    layoutCols: {
      control: { type: 'number' },
      table: { category: 'DesignTokens' },
    },
    layoutFactor: {
      control: { type: 'number' },
      table: { category: 'DesignTokens' },
    },

    layout: {
      options: ['list', 'column', 'two-column', 'carousel', 'grid', 'flex'],
      control: { type: 'select' },
    },
    align: {
      options: ['start', 'stretch', 'end', 'center'],
      control: { type: 'select' },
    },
    demoItemCount: {
      control: { type: 'number', max: 24 },
      table: { category: 'Demo' },
    },
    background: {
      control: { type: 'color' },
      table: { category: 'Customize' },
    },
    customItem: {
      control: { type: 'number' },
      table: { category: 'Customize' },
    },
    span: {
      control: { type: 'number' },
      table: { category: 'Customize' },
    },
    customLayout: {
      options: ['list', 'carousel', 'grid', 'column', 'flex'],
      control: { type: 'select' },
      table: { category: 'Customize' },
    },
    sticky: {
      control: { type: 'boolean' },
      table: { category: 'Customize' },
    },
    paddingInline: {
      control: { type: 'text' },
      table: { category: 'Customize' },
    },
    paddingBlock: {
      control: { type: 'text' },
      table: { category: 'Customize' },
    },
    marginInline: {
      control: { type: 'text' },
      table: { category: 'Customize' },
    },
    marginBlock: {
      control: { type: 'text' },
      table: { category: 'Customize' },
    },
    customItemCount: {
      control: { type: 'number' },
      table: { category: 'Customize' },
    },
    gap: {
      control: { type: 'text' },
      table: { category: 'Styling' },
    },
  },
} as Meta;

interface DemoProps {
  layoutCols?: number;
  layoutFactor?: number;
  demoItemCount: number;
  customItem: number;
  customItemCount: number;
  customLayout?: string;
  color?: string;
}

const Template: Story<DemoProps & StyleRuleSet> = (
  props: DemoProps & StyleRuleSet
): TemplateResult => {
  // if (Number(props.gap)) {
  //   props.gap += 'px';
  // }

  if (props.span !== undefined && props.span < 1) {
    // props.span = 1;
  }

  console.log(props.layout);

  return html`
    <oryx-layout .layout=${props.layout}>
      ${Array.from({ length: props.demoItemCount }, (_, i) => {
        const item = (id: number, postfix?: string) =>
          html`<div id="item-${id}">${id}${postfix}</div>`;
        if (i === props.customItem - 1) {
          return html`
            <oryx-layout
              id="item-${i + 1}"
              .layout=${props.customLayout}
              ?sticky=${props.sticky}
            >
              ${Array.from({ length: props.customItemCount }, (_, j) =>
                item(j + 1, ` (n)`)
              )}
            </oryx-layout>
          `;
        } else {
          return item(i + 1);
        }
      })}
    </oryx-layout>
  `;
};

export const Demo = Template.bind({});
