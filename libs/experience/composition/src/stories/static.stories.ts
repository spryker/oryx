import { Meta, Story } from '@storybook/web-components';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { storybookPrefix } from '../../../constants';
import { layoutStyles } from '../style';

export default {
  title: `${storybookPrefix}/Composition/Layout/Static`,
  parameters: {
    chromatic: { delay: 300 },
  },
} as Meta;

@customElement('fake-static-layout')
class FakeStaticLayout extends LitElement {
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

      div:nth-child(2):not(.content) {
        padding: 30px;
        border: solid 5px var(--oryx-color-ink);
      }
    `,
  ];

  @property() elementCount = 8;

  override render(): TemplateResult {
    return html`
      ${Array.from(Array(this.elementCount).keys()).map(
        (i) =>
          html`<div
            style=${i === 2 ? '--oryx-layout-span:2;flex: 0 0 50%;' : ''}
          >
            <div class="content">${i + 1}</div>
          </div>`
      )}
    `;
  }
}

const Template: Story<unknown> = (): TemplateResult => {
  const gen = (layout: string, colCount = 4): TemplateResult => html` <h3>
      ${layout} (${colCount})
    </h3>
    <fake-static-layout
      .elementCount=${colCount * 2 + 1}
      style="--oryx-layout-item-count:${colCount}"
      class="xs-layout-${layout}"
    >
    </fake-static-layout>`;

  return html`
    <div style="--oryx-layout-gap:5px;--oryx-layout-height: 200px;">
      <h2>Four columns</h2>
      ${gen('grid', 4)} ${gen('carousel', 4)} ${gen('column', 4)}

      <h2>Two columns</h2>
      ${gen('grid', 2)} ${gen('carousel', 2)} ${gen('column', 2)}

      <h2>One column</h2>
      ${gen('grid', 1)} ${gen('carousel', 1)} ${gen('column', 1)}
    </div>
  `;
};

export const StaticLayout = Template.bind({});
