import { css } from 'lit';
import { blockSelector } from '../base.styles';

const styles = [
  css`
    :host(${blockSelector}) {
      background: var(--oryx-color-canvas-200);
      position: relative;
    }

    :host(${blockSelector}) summary {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      text-transform: uppercase;
      padding-block: 9px;
      list-style: none;
      transition: background var(--oryx-transition-time);
      padding-inline: 20px 10px;
    }

    :host(${blockSelector}) summary + slot {
      padding-inline: 20px;
    }

    :host(${blockSelector}) slot[name='side-dish']::slotted(*) {
      margin-inline-start: 20px;
    }

    :host(${blockSelector}) details[open] summary {
      border-block-end: 1px solid var(--oryx-color-canvas-500);
    }

    :host(${blockSelector}:hover) summary {
      background: var(--oryx-color-canvas-500);
    }

    /*
      We isolate this style for both inline/block since "storybook-addon-pseudo-states"
      doesn't support us otherwise.
    */
    summary:focus-visible::after {
      box-shadow: var(--oryx-box-shadow-focus);
    }

    oryx-icon-button {
      color: var(--oryx-color-neutral-300);
    }

    summary:hover oryx-icon-button {
      color: var(--oryx-color-neutral-400);
    }

    :host(${blockSelector}) slot:not([name]) {
      display: block;
      padding-block: 13px;
    }
  `,
];

export const collapsibleBackofficeUI = {
  styles,
};
