import { css } from 'lit';

export const carouselNavigationStyles = css`
  :host {
    display: contents;
  }

  oryx-button {
    position: absolute;
    z-index: 1;
    align-self: center;
    transition: opacity 0.3s;
  }

  oryx-button.previous {
    margin-inline-start: 8px;
  }

  oryx-button.next {
    margin-inline-start: calc(var(--width) - 44px);
  }

  :host(:not([has-previous])) oryx-button.previous,
  :host(:not([has-next])) oryx-button.next {
    opacity: 0;
    pointer-events: none;
  }

  form.indicators {
    display: flex;
    gap: 10px;
    position: absolute;
    justify-content: center;
    align-self: end;
    width: var(--width);
    height: var(--indicator-area-height);
    margin-block-end: calc(var(--indicator-area-height) * -1);
  }

  input {
    width: 16px;
    height: 16px;
    padding: 0;
    border-radius: 50%;
    border: none;
    align-self: center;
    background: var(--oryx-color-neutral-6);
    cursor: pointer;
    appearance: none;
  }

  input:hover {
    background: var(--oryx-color-neutral-7);
  }

  input::after {
    content: '';
    background: var(--oryx-color-primary-9);
    width: inherit;
    height: inherit;
    border-radius: inherit;
    display: block;
    opacity: var(--opacity, 0);
  }
`;
