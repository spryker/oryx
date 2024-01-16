import { TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { ActionComponentAttributes } from '../action.model';

export interface Props {
  text?: string;
  slotted?: 'link' | 'button' | 'content';
  block?: boolean;
  width?: string;
}

export const renderAction = (
  props: ActionComponentAttributes & Props
): TemplateResult => {
  let template;
  const text = props.slotted ? undefined : props.text;
  const mark = props.slotted ? undefined : props.mark;
  const icon = props.slotted ? undefined : props.icon;
  const iconAfter = props.slotted ? undefined : props.iconAfter;
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
      .size=${props.size}
      ?cta=${props.cta}
      ?alert=${props.alert}
      .text=${text}
      .mark=${mark}
      .icon=${icon}
      .iconAfter=${iconAfter}
      .href=${href}
      ?block=${props.block}
      .state=${props.state}
      ?disabled=${props.disabled}
      ?loading=${props.loading}
      ?confirmed=${props.confirmed}
      style="width:${props.width}"
      >${template}</oryx-action
    >
  `;
};
