import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

import { IconTypes } from '@spryker-oryx/ui/icon';
import { when } from 'lit/directives/when.js';
import { ActionState, ActionType } from '../action.model';
import { renderAction } from './util';

const icon = IconTypes.Add;
const text = 'text';
const type = undefined;
const cta = true;
const disabled = true;
const confirmed = true;
const loading = true;
const alert = true;
const width = '300px';

export default {
  title: `${storybookPrefix}/Actions/Action`,
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    ${[
      ActionType.Button,
      ActionType.Text,
      ActionType.Icon,
      ActionType.Tile,
    ].map(
      (type) => html`<h1>${type}</h1>
        ${[false, true].map(
          (cta) => html`
            ${[undefined, 'https://foo.com'].map(
              (href) => html`
                <div class="list">
                  ${when(type !== ActionType.Icon, () => [
                    renderAction({ type, cta, href, text }),
                    renderAction({ type, cta, href, text, alert }),
                    renderAction({
                      type,
                      cta,
                      href,
                      text,
                      state: ActionState.Active,
                    }),
                    renderAction({
                      type,
                      cta,
                      href,
                      text,
                      state: ActionState.Disabled,
                    }),
                    renderAction({ type, cta, href, text, icon }),
                    renderAction({
                      type,
                      cta,
                      href,
                      text,
                      iconAfter: icon,
                    }),
                    renderAction({
                      type,
                      cta,
                      href,
                      text,
                      icon: 'add',
                      iconAfter: IconTypes.ArrowForward,
                    }),
                    renderAction({
                      type,
                      cta,
                      href,
                      text,
                      icon: 'add',
                      alert,
                    }),
                  ])}
                  ${[
                    renderAction({ type, cta, href, label: text, icon }),
                    renderAction({
                      type,
                      cta,
                      href,
                      label: text,
                      icon,
                      state: ActionState.Disabled,
                    }),
                    renderAction({
                      type,
                      cta,
                      href,
                      label: text,
                      icon,
                      state: ActionState.Loading,
                    }),
                    renderAction({
                      type,
                      cta,
                      href,
                      label: text,
                      icon,
                      state: ActionState.Confirmed,
                    }),
                    renderAction({ type, cta, href, label: text, icon, alert }),
                    renderAction({
                      type,
                      cta,
                      href,
                      text,
                      icon,
                      state: ActionState.Disabled,
                    }),
                    renderAction({
                      type,
                      cta,
                      href,
                      text,
                      icon,
                      state: ActionState.Confirmed,
                    }),
                    renderAction({
                      type,
                      cta,
                      href,
                      text,
                      icon,
                      state: ActionState.Loading,
                    }),
                    renderAction({ type, cta, href, text, icon, alert }),
                  ]}
                  ${when(
                    type === ActionType.Button || type === ActionType.Text,
                    () => [renderAction({ type, cta, href, text, icon, width })]
                  )}
                  ${when(type === ActionType.Tile, () => [
                    renderAction({ type, cta, href, text, icon, mark: '5' }),
                    renderAction({ type, cta, href, text, icon, mark: '99+' }),
                  ])}
                </div>
              `
            )}
          `
        )}`
    )}
    ${[
      ['Small', -2],
      ['Medium', 0],
      ['Large', 2],
      ['Large on mobile', 4],
    ].map(
      (size) => html`<h3>${size[0]}</h3>
        <div style="font-size: calc(1rem + ${size[1]}px)">
          <p>
            This is text
            ${renderAction({ type: ActionType.Text, text: 'with a link' })}
            inside.
          </p>
          ${[
            renderAction({ type, text, icon }),
            renderAction({ type: ActionType.Button, text, icon }),
            renderAction({ type: ActionType.Button, text, icon, disabled }),
            renderAction({ type: ActionType.Button, text, icon }),
            renderAction({ type: ActionType.Icon, text, icon }),
            renderAction({ type: ActionType.Link, text, icon }),
            renderAction({ type: ActionType.Link, text, icon }),
          ]}
        </div> `
    )}

    <h3>Alignment</h3>
    <div class="align">
      ${[
        html`<span style="font-size:12px">
          ${renderAction({ type, text, icon })}
        </span>`,
        renderAction({ type: ActionType.Link, text, icon: 'check' }),
        html`<span style="font-size:16px">
          ${renderAction({ type: ActionType.Link, text, icon: 'check' })}
        </span>`,
      ]}
    </div>

    <style>
      div.list {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
        margin-block: 10px;
      }
      .align {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 100px;
        background: var(--oryx-color-neutral-1);
      }
    </style>
  `;
};

export const Button = Template.bind({});
