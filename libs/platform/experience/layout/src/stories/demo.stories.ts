import { StyleRuleSet } from '@spryker-oryx/experience';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constants';

export default {
  title: `${storybookPrefix}/Layout`,
  args: {
    layout: 'grid',
    gap: '5px',
    demoItemCount: 12,
    customItem: 2,
    customItemCount: 4,
    customLayout: 'grid',
    background: 'deeppink',
    sticky: false,
    bleed: false,
    marginInline: '0',
    marginBlock: '0',
    paddingInline: '0',
    paddingBlock: '0',
  },
  argTypes: {
    // layoutCols: {
    //   control: { type: 'number' },
    //   table: { category: 'DesignTokens' },
    // },
    // layoutFactor: {
    //   control: { type: 'number' },
    //   table: { category: 'DesignTokens' },
    // },
    layout: {
      options: ['list', 'column', 'split-column', 'carousel', 'grid', 'flex'],
      control: { type: 'select' },
    },
    splitColumnFactor: {
      control: { type: 'number' },
      table: { category: 'DesignTokens' },
    },
    gap: {
      control: { type: 'text' },
      table: { category: 'Styling' },
    },
    align: {
      options: ['start', 'stretch', 'end', 'center'],
      control: { type: 'select' },
      table: { category: 'Styling' },
    },
    // demo
    demoItemCount: {
      control: { type: 'number', max: 24 },
      table: { category: 'Demo' },
    },
    customItem: {
      control: { type: 'number' },
      table: { category: 'Demo' },
    },
    customItemCount: {
      control: { type: 'number' },
      table: { category: 'Demo' },
    },
    customLayout: {
      options: ['list', 'carousel', 'grid', 'column', 'flex'],
      control: { type: 'select' },
      table: { category: 'Demo' },
    },
    colSpan: {
      control: { type: 'number' },
      table: { category: 'Demo' },
    },
    background: {
      control: { type: 'color' },
      table: { category: 'Demo' },
    },

    sticky: {
      control: { type: 'boolean' },
      table: { category: 'Customize' },
    },
    bleed: {
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

  // if (props.colSpan !== undefined && props.colSpan < 1) {
  //   props.colSpan = 1;
  // }

  const addStyle = (prop: string, value?: number | string): string => {
    return value ? `${prop}: ${value};` : '';
  };

  let mainStyle = '';
  const gaps = props.gap?.split(' ');
  mainStyle += addStyle('--oryx-grid-gap-column', gaps?.[1] ?? gaps?.[0]);
  mainStyle += addStyle('--oryx-grid-gap-row', gaps?.[0]);
  mainStyle += addStyle('align-items', props.align);

  let style = '';

  style += addStyle('background', props.background);

  style += addStyle('--col-span', props.colSpan);
  style += addStyle('--row-span', props.rowSpan);
  style += addStyle('--split-column-factor', props.splitColumnFactor);

  return html`
    <oryx-layout .layout=${props.layout} style=${mainStyle}>
      ${Array.from({ length: props.demoItemCount }, (_, i) => {
        const item = (id: number, postfix?: string) =>
          html`<div id="item-${id}">${id}${postfix}</div>`;
        if (i === props.customItem - 1) {
          return html`
            <oryx-layout
              id="item-${i + 1}"
              .layout=${props.customLayout}
              style=${style}
              ?sticky=${props.sticky}
              ?bleed=${props.bleed}
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

    <style></style>
  `;
};

export const Demo = Template.bind({});
