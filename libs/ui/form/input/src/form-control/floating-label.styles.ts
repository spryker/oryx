import { css } from 'lit';

export const floatingLabelStyles = css`
  :host([floatLabel]) {
    --float-label-start-gap: 0;

    position: relative;
  }

  :host([floatLabel]) slot[name='label'] {
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: var(--oryx-color-neutral-darker);
    position: absolute;
    top: 13px;
    inset-inline-start: calc(var(--float-label-start-gap) + 13px);
    max-width: calc(100% - 26px - var(--float-label-start-gap));
    z-index: 1;
    transition: 100ms;
  }

  :host([floatLabel]) slot:not([name])::slotted(*)::placeholder {
    opacity: 0%;
  }

  :host([floatLabel]:is(:focus-within, [has-value])) slot[name='label'] {
    background-color: var(--oryx-color-canvas);
    padding: 3px 8px;
    top: -10px;
    inset-inline-start: 20px;
    border-radius: var(--oryx-border-radius-small);
    max-width: calc(100% - 56px);
  }

  :host([floatLabel][has-prefix]:is(:focus-within, [has-value]))
    slot[name='label'] {
    inset-inline-start: calc(var(--float-label-start-gap) + 7px);
    max-width: calc(100% - 30px - calc(var(--float-label-start-gap)));
  }

  :host([floatLabel][has-value][disabled]) slot[name='label'] {
    background-color: var(--oryx-color-neutral-lighter);
  }

  @media (max-width: 767px) {
    :host([floatLabel]) slot[name='label'] {
      top: 17px;
    }
  }
`;
