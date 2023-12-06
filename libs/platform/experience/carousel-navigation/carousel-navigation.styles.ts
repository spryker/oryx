import { css } from 'lit';

export const carouselNavigationStyles = css`
  :host {
    display: grid;
    pointer-events: all;
    position: absolute;
    width: var(--width);
    height: calc(var(--height) + var(--indicator-area-height, 50px));
  }

  .indicators,
  oryx-button {
    position: absolute;
    z-index: 1;
  }

  oryx-button {
    transition: opacity 0.3s;
  }

  :host(:not([vertical])) oryx-button {
    align-self: center;
  }

  :host([vertical]) oryx-button {
    justify-self: center;
  }

  :host([vertical]) oryx-button.previous {
    align-self: start;
    margin-block-start: 8px;
  }

  :host([vertical]) oryx-button.next {
    align-self: end;
    margin-block-end: 8px;
  }

  :host(:not([vertical])) oryx-button.previous {
    margin-inline-start: 8px;
  }

  :host(:not([vertical])) oryx-button.next {
    margin-inline-start: calc(var(--width) - 44px);
  }

  :host(:not([has-previous])) oryx-button.previous,
  :host(:not([has-next])) oryx-button.next {
    opacity: 0;
    pointer-events: none;
  }

  .indicators {
    box-sizing: border-box;
    display: flex;
    gap: 10px;
    padding-inline: 10px;
    align-self: end;
    width: var(--width);
    height: var(--indicator-area-height, 50px);
  }

  :host([indicatorsAlignment='center']) .indicators {
    justify-content: center;
  }

  :host([indicatorsAlignment='start']) .indicators {
    justify-content: start;
  }

  :host([indicatorsAlignment='end']) .indicators {
    justify-content: end;
  }

  input {
    width: 16px;
    height: 16px;
    margin: 4px;
    padding: 0;
    border-radius: 50%;
    border: none;
    align-self: center;
    background: var(--oryx-color-neutral-6);
    cursor: pointer;
    appearance: none;
    transition: width, height, margin;
    transition-duration: var(--oryx-transition-time);
  }

  input:hover {
    background: var(--oryx-color-neutral-7);
    width: 20px;
    height: 20px;
    margin: 2px;
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
