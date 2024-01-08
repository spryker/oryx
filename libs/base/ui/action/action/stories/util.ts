import { TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { ActionComponentAttributes } from '../action.model';

export interface Props {
  text?: string;
  slotted?: 'link' | 'button' | 'content';
  block?: boolean;
}

export const renderAction = (
  props: ActionComponentAttributes & Props
): TemplateResult => {
  let template;
  const text = props.slotted ? undefined : props.text;
  const mark = props.slotted ? undefined : props.mark;
  const icon = props.slotted ? undefined : props.icon;
  const href = props.slotted === 'link' ? undefined : props.href;

  if (props.slotted === 'content') {
    template = html`
      ${when(
        props.icon,
        () => html`<oryx-icon .type=${props.icon}></oryx-icon>`
      )}
      ${props.text}
    `;
  }

  if (props.slotted === 'link') {
    template = html`
      <a href=${props.href ?? 'https://spryker.com'} slot="custom">
        ${when(
          props.icon,
          () => html`<oryx-icon .type=${props.icon}></oryx-icon>`
        )}
        ${props.text}
      </a>
    `;
  }

  if (props.slotted === 'button') {
    template = html`
      <button slot="custom">
        ${when(
          props.icon,
          () => html`<oryx-icon .type=${props.icon}></oryx-icon>`
        )}
        ${props.text}
      </button>
    `;
  }

  return html`
    <oryx-action
      .type=${props.type}
      .color=${props.color}
      .size=${props.size}
      .text=${text}
      .mark=${mark}
      .icon=${icon}
      .href=${href}
      ?block=${props.block}
      ?disabled=${props.disabled}
      ?loading=${props.loading}
      ?confirmed=${props.confirmed}
      >${template}</oryx-action
    >
  `;
};
