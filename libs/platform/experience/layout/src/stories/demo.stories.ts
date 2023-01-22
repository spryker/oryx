import { StyleRuleSet } from '@spryker-oryx/experience';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
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
  if (Number(props.gap)) {
    props.gap += 'px';
  }

  if (props.span !== undefined && props.span < 1) {
    // props.span = 1;
  }

  return html`
    <div class="layout-demo">
      <p>We offer a 2 dimensional grid to play with:</p>
      <ol>
        <li>
          The first grid only allows to specify the number of grid items and the
          grid layout.
        </li>
        <li>
          There's 1 item in the grid that you can manipulate with options. This
          also include the creation of nested items and their layout.
        </li>
      </ol>
      <oryx-layout
        .layout=${props.layout}
        style="--gap: ${props.gap || '0px'};--align-items: ${props.align}"
      >
        ${Array.from(
          { length: props.demoItemCount },
          (_, i) => html`
            ${when(
              i === props.customItem - 1,
              () =>
                html`<oryx-layout
                  id="item-${i + 1}"
                  .layout=${props.customLayout}
                  ?sticky=${props.sticky}
                >
                  ${Array.from(
                    { length: props.customItemCount },
                    (_, j) => html`<div>${j + 1} (n)</div>`
                  )}
                </oryx-layout>`,
              () => html`<div id="item-${i + 1}">${i + 1}</div>`
            )}
          `
        )}
      </oryx-layout>
    </div>
    <style>
      .layout-demo {
        ${when(
        props.layoutCols,
        () => html`--oryx-layout-cols: ${props.layoutCols};`
      )};

        ${when(
        props.layoutFactor,
        () => html`--oryx-layout-factor: ${props.layoutFactor};`
      )};
      }
      oryx-layout > * {
        border: solid 1px red;
        min-height: 100px;
        /* display: flex; */
        /* justify-content: center;
        align-items: center; */
      }

      #item-${props.customItem} {
        ${when(props.span, () => html`--span: ${props.span};`)};
        ${when(
        props.paddingInline,
        () => html`--padding-inline: ${props.paddingInline};`
      )};
        ${when(
        props.paddingBlock,
        () => html`padding-block: ${props.paddingBlock};`
      )};
        ${when(
        props.marginInline,
        () => html`margin-inline: ${props.marginInline};`
      )};
        ${when(
        props.marginBlock,
        () => html`margin-block: ${props.marginBlock};`
      )};
      }

      #item-${props.customItem}  div {
        background: ${props.background};
      }
    </style>
  `;
};

export const Demo = Template.bind({});
