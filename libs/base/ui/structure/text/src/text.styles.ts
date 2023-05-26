import { primaryColor } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const textStyles = css`
  :host {
    --_text-line-clamp: var(--line-clamp, 0);

    display: flex;
    flex-direction: column;
    padding-block: 20px;
  }

  ::slotted(p) {
    margin-block-start: 0;
    transition: margin-bottom 0.8s cubic-bezier(0, 1, 0, 1);
  }

  :host([truncation]) div {
    overflow: hidden;
  }

  :host([truncation][truncated]) ::slotted(p) {
    display: inline;
  }

  :host([truncation][truncated]) ::slotted(p)::after {
    content: ' ';
  }

  :host([truncation][truncated]) div {
    max-height: calc(var(--_text-line-clamp) * var(--oryx-line-height, 24px));
    transition: max-height var(--oryx-transition-time) cubic-bezier(0, 1, 0, 1);
  }

  :host(:not([truncated])) div {
    max-height: calc(
      var(--lines-count, 100rem) * var(--oryx-line-height, 24px)
    );
    transition: max-height var(--oryx-transition-time) ease-out;
  }

  slot:not([name]) {
    display: block;
  }

  :host([truncated]) slot:not([name]) {
    /* stylelint-disable-next-line */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--_text-line-clamp);
    line-clamp: var(--_text-line-clamp);
    text-overflow: ellipsis;
    overflow: hidden;
  }

  :host([initialized][truncated]) slot:not([name]) {
    animation: close 0.1s ease 0.1s forwards;
    -webkit-line-clamp: initial;
    line-clamp: initial;
  }

  /* stylelint-disable-next-line */
  @media (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) and (stroke-color: transparent) {
      :host([initialized][truncated]) slot:not([name]) {
        /* this won't function on safari */
        -webkit-line-clamp: var(--_text-line-clamp);
      }
    }
  }

  :host(:not([truncated])) {
    animation: open 0.1s ease 0s forwards;
  }

  oryx-icon-button {
    display: inline-flex;
    align-self: center;
    margin: 10px 0;
    transition: transform var(--oryx-transition-time-long) ease-in-out;
    color: ${primaryColor()};
  }

  :host(:not([truncated])) oryx-icon-button {
    transform: rotate(180deg);
  }

  /* FF won't render line-clamp properly wen there's not wrapping block element surrounding
   * various child elements. This breaks Safari, hence we limit this behaviour only to FF. */
  @supports (-moz-appearance: none) {
    slot:not([name]) {
      display: block;
    }
  }

  :host(:not([truncation])) slot[name='toggle'] {
    display: none;
  }

  @keyframes open {
    from {
      line-clamp: var(--_text-line-clamp);
      -webkit-line-clamp: var(--_text-line-clamp);
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
      line-clamp: var(--_text-line-clamp);
      -webkit-line-clamp: var(--_text-line-clamp);
    }
  }
`;
