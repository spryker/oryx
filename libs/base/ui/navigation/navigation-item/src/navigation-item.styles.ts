import { css } from 'lit';

export const navigationItemStyles = css`
  :host {
    --oryx-navigation-item-vertical-padding: 16px;
    --oryx-navigation-item-divider-padding: 10px;
    --oryx-navigation-item-divider-position: calc(
      0px - var(--oryx-navigation-item-vertical-padding) * 2 -
        var(--oryx-navigation-item-divider-padding)
    );

    color: var(--oryx-color-neutral-9);
    display: flex;
    box-sizing: border-box;
    padding: var(--oryx-navigation-item-vertical-padding) 17px;
    gap: 13px;
    outline: none;
    align-items: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 250px;
    transition: all var(--oryx-transition-time);
    padding-inline-start: calc((var(--navigation-collapsed) * 19px) + 17px);
  }

  :host-context([collapsed]) {
    padding-inline-start: 35px;
  }

  .text {
    display: flex;
    transition: all var(--oryx-transition-time);
    opacity: calc((var(--navigation-collapsed) - 1) * -1);
  }

  :host([active]:not([active='false'])) {
    color: var(--oryx-color-primary-9);
    pointer-events: none;
  }

  :host([active]:not([active='false']))::before {
    content: '';
    background-color: var(--oryx-color-primary-9);
    position: absolute;
    inset-inline-start: 0;
    height: 36px;
    width: 4px;
    border-radius: 4px;
  }

  :host([divider])::after {
    content: '';
    background-color: var(--oryx-color-neutral-5);
    position: absolute;
    width: 80%;
    height: 1px;
    transform: translateY(var(--oryx-navigation-item-divider-position));
  }

  :host([divider]) {
    margin-block-start: calc(var(--oryx-navigation-item-vertical-padding) * 2);
  }

  :host([divider]:host-context([collapsed]))::after {
    transform: translateY(var(--oryx-navigation-item-divider-position))
      translateX(-33%);
  }

  ::slotted(*) {
    display: contents;
    text-decoration: none;
    color: inherit;
  }

  ::slotted(oryx-icon) {
    border: solid 1px blue;
  }
`;
