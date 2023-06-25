import { css } from 'lit';

export const collapsibleTextStyles = css`
  :host {
    line-height: var(--oryx-line-height, 22px);
  }

  ::slotted(p) {
    margin-block-start: var(--oryx-line-height, 22px);
    margin-block-end: 0px;
  }

  ::slotted(p:first-child) {
    margin-block-start: 0px;
  }

  :host {
    display: grid;
    justify-items: center;
    gap: 10px;
  }

  :host([expanded]) slot {
    --line-clamp: var(--line-count) !important;
  }

  slot {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    max-height: calc(var(--line-clamp) * var(--line-height, 22px));
    transition: max-height var(--oryx-transition-time) ease;
    animation: collapsed var(--oryx-transition-time) linear 0.1s forwards;
  }

  :host([expanded]) slot {
    max-height: calc(var(--line-count) * var(--line-height, 22px));
    transition: max-height var(--oryx-transition-time) ease;
    animation: expanded var(--oryx-transition-time) linear 0.1s forwards;
  }

  @keyframes collapsed {
    from {
      -webkit-line-clamp: var(--line-count);
    }
    to {
      -webkit-line-clamp: var(--line-clamp);
    }
  }

  @keyframes expanded {
    from {
      -webkit-line-clamp: var(--line-clamp);
    }
    to {
      -webkit-line-clamp: var(--line-count);
    }
  }

  :host(:not([requiresToggle])) oryx-icon-button {
    display: none;
  }

  oryx-icon-button {
    transition: transform var(--oryx-transition-time-long) ease-in-out;
    color: var(--oryx-color-primary-9);
  }

  :host([expanded]) oryx-icon-button {
    transform: rotate(180deg);
  }
`;
