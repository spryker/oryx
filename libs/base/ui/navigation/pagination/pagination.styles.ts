import { css, unsafeCSS } from 'lit';

const navSize = unsafeCSS('36px');
const indentSize = unsafeCSS('5px');

export const paginationStyles = css`
  :host([is-empty]) {
    display: none;
  }

  :host {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${indentSize};
  }

  slot[name='previous'] *,
  slot[name='next'] * {
    --oryx-icon-size: 16px;
  }

  ::slotted(*),
  *[truncated],
  a {
    height: ${navSize};
    width: ${navSize};
    align-items: center;
    justify-content: center;
  }

  ::slotted(*),
  a {
    border: 1px solid var(--oryx-color-neutral-6);
    border-radius: var(--oryx-border-radius-small);
    background: var(--oryx-color-neutral-1);
    transition: var(--oryx-transition-time);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-decoration: none;
    outline: none;
  }

  ::slotted(*),
  :host > a {
    display: flex;
  }

  ::slotted(:not([visible])) {
    display: none;
  }

  ::slotted(*) {
    color: var(--oryx-color-neutral-11);
  }

  ::slotted(*[disabled]) {
    color: var(--oryx-color-neutral-9);
  }

  a {
    color: var(--oryx-color-neutral-9);
  }

  a[disabled] {
    color: var(--oryx-color-neutral-8);
  }

  slot[name='truncated'] * {
    --oryx-icon-size: 12px;

    transform: rotate(90deg);
  }

  span[truncated] {
    position: absolute;
    display: none;
  }

  :host([start-truncated]) ::slotted(*:nth-child(1)) {
    margin-inline-end: calc(${navSize} + ${indentSize});
  }

  :host([end-truncated]) ::slotted(*:last-child) {
    margin-inline-start: calc(${navSize} + ${indentSize});
  }

  :host([start-truncated]) [truncated]:first-of-type,
  :host([end-truncated]) [truncated]:last-of-type {
    display: flex;
  }

  :host(:not([enableNavigation])) span[truncated]:first-of-type {
    inset-inline-start: calc(${navSize} + ${indentSize} + 2px);
  }

  span[truncated]:first-of-type {
    inset-inline-start: calc((${navSize} + ${indentSize} + 2px) * 2);
  }

  :host(:not([enableNavigation])) span[truncated]:last-of-type {
    inset-inline-end: calc(${navSize} + ${indentSize} + 2px);
  }

  span[truncated]:last-of-type {
    inset-inline-end: calc((${navSize} + ${indentSize} + 2px) * 2);
  }

  ::slotted(*[start-range]) {
    margin-inline-start: calc(${navSize} + ${indentSize} + 2px);
  }

  ::slotted(*[end-range]) {
    margin-inline-end: calc(${navSize} + ${indentSize});
  }

  ::slotted(*:hover),
  a:not([truncated]):hover {
    transition: var(--oryx-transition-time);
    border-color: var(--oryx-color-neutral-8);
  }

  ::slotted(*[active]),
  ::slotted(*:active),
  ::slotted(*:focus-visible),
  a:not([truncated]):active,
  a:not([truncated]):focus-visible {
    border-color: var(--oryx-color-primary-9);
  }

  ::slotted(*[active]),
  ::slotted(*[disabled]),
  a[disabled] {
    pointer-events: none;
  }

  ::slotted(*[active]),
  ::slotted(*:active),
  a:not([truncated]):active {
    color: var(--oryx-color-neutral-1);
    background: var(--oryx-color-primary-9);
  }

  ::slotted(*:focus-visible),
  *:focus-visible {
    box-shadow: 0 0 3px var(--oryx-color-primary-9);
  }

  ::slotted(*[disabled]),
  a[disabled] {
    background-color: var(--oryx-color-neutral-3);
  }

  a[direction='previous'] {
    transform: scaleX(-1);
  }
`;
