import { Meta, Story } from '@storybook/web-components';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { storybookPrefix } from '../../../constants';
import { layoutStyles } from '../style';

export default {
  title: `${storybookPrefix}/Composition/Layout`,
  parameters: {
    chromatic: { delay: 1000 },
  },
  args: {
    columnCount: 4,
    layout: 'grid',
    elementHeight: '50px',
    elementWidth: '50%',
    span: 1,
    padding: '0px',
    borderWidth: '0px',
  },
  argTypes: {
    layout: {
      options: ['grid', 'carousel', 'column'],
      control: { type: 'radio' },
    },
  },
} as Meta;

@customElement('fake-layout')
class FakeLayout extends LitElement {
  static styles = [
    layoutStyles,
    css`
      div {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
      }
      div.content {
        background-color: var(--oryx-color-neutral-lighter);
        width: 100%;
        height: 100%;
      }
      div[style*='span'] > div.content {
        background-color: var(--oryx-color-brand);
      }

      div:nth-child(3):not(.content) {
        border: solid 0px var(--oryx-color-ink);
      }
    `,
  ];

  @property() elementCount = 8;
  @property() span = 1;
  @property() padding = '0px';
  @property() borderWidth = '0px';
  @property() elementHeight = '50px';
  @property() elementWidth = '50%';

  override render(): TemplateResult {
    return html`
      ${Array.from(Array(this.elementCount).keys()).map(
        (i) =>
          html`<div
            style=${i === 0
              ? `--oryx-layout-span:${this.span};flex: 0 0 ${this.elementWidth};padding: ${this.padding};border-width: ${this.borderWidth}`
              : ''}
          >
            <div class="content">${i + 1}</div>
          </div>`
      )}
    `;
  }
}

interface Props {
  columnCount: number;
  layout: string;
  elementHeight: string;
  elementWidth: string;
  span: number;
  padding: string;
  borderWidth: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <div
      style="--oryx-layout-gap:5px;--oryx-layout-height: ${props.elementHeight};"
    >
      <fake-layout
        .elementCount=${12}
        .elementHeight=${props.elementHeight}
        .elementWidth=${props.elementWidth}
        .span=${props.span}
        .padding=${props.padding}
        .borderWidth=${props.borderWidth}
        style="--oryx-layout-item-count:${props.columnCount}"
        class="xs-layout-${props.layout}"
      >
      </fake-layout>
    </div>
  `;
};

export const DemoLayout = Template.bind({});
