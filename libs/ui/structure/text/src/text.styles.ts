import { css } from 'lit';

export const textStyles = css`
  :host {
    display: flex;
    flex-direction: column;
  }

  ::slotted(p) {
    margin-top: 0;
    transition: margin-bottom 0.8s cubic-bezier(0, 1, 0, 1);
  }

  :host([concatenate][truncate]) ::slotted(*) {
    display: inline;
  }

  .box {
    overflow: hidden;
  }

  :host([truncate]) .box {
    max-height: calc(var(--line-clamp) * var(--oryx-line-height, 24px));
    transition: max-height var(--oryx-transition-time) cubic-bezier(0, 1, 0, 1);
  }

  :host(:not([truncate])) .box {
    max-height: 100rem;
    transition: max-height var(--oryx-transition-time)
      cubic-bezier(0.9, 0, 0.8, 0.2);
  }

  :host([truncate]) .text {
    /* stylelint-disable-next-line */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--line-clamp);
    line-clamp: var(--line-clamp);
    text-overflow: ellipsis;
    overflow: hidden;
  }

  :host([truncate][initialised]) .text {
    animation: close 0.1s linear 0.1s forwards;
    -webkit-line-clamp: initial;
    line-clamp: initial;
  }

  /* stylelint-disable-next-line */
  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) and (stroke-color: transparent) {
      :host([truncate][initialised]) .text {
        /* this won't function on safari */
        -webkit-line-clamp: var(--line-clamp);
      }
    }
  }

  :host(:not([truncate])) {
    animation: open 0.1s linear 0s forwards;
  }

  oryx-icon-button {
    display: inline-flex;
    align-self: center;
    margin: 10px 0;
    transition: transform var(--oryx-transition-time-long) ease-in-out;
    color: var(--oryx-color-brand);
  }

  :host(:not([truncate])) oryx-icon-button {
    transform: rotate(180deg);
  }

  :host(:not([requires-truncate])) slot[name='toggle'] {
    display: none;
  }

  @keyframes open {
    from {
      line-clamp: var(--line-clamp, 1);
      -webkit-line-clamp: var(--line-clamp, 1);
    }
    to {
      line-clamp: initial;
      -webkit-line-clamp: initial;
    }
  }

  @keyframes close {
    from {
      line-clamp: initial;
      -webkit-line-clamp: initial;
    }
    to {
      line-clamp: var(--line-clamp, 1);
      -webkit-line-clamp: var(--line-clamp, 1);
    }
  }
`;
