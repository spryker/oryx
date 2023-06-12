import { css } from 'lit';

export const productImageStyles = css`
  :host {
    --gap: 15px;

    display: block;
  }

  :host > oryx-layout {
    display: grid;
    gap: var(--gap);
  }

  :host > oryx-layout[navigation='start'] {
    grid-template-columns: auto 1fr;
  }

  :host > oryx-layout[navigation='start'] .navigation {
    justify-self: start;
  }

  :host > oryx-layout[navigation='end'] {
    grid-template-columns: 1fr auto;
  }

  :host > oryx-layout[navigation='end'] .navigation {
    justify-self: end;
  }

  .main {
    --cols: 1;
  }

  .navigation {
    --cols: initial;

    padding: 6px;
  }

  .main > *,
  .navigation[vertical] {
    height: var(--product-image-height);
  }

  .main[behavior='disable'] {
    scroll-behavior: initial;
  }

  :host > oryx-layout[floating] > :is(.navigation, .main) {
    grid-column: 1;
    grid-row: 1;
  }

  :host > oryx-layout[floating] .navigation {
    z-index: 1;
  }

  :host > oryx-layout[floating][navigation='bottom'] .navigation {
    align-self: end;
  }

  label {
    position: relative;
    padding: 10px;
    background-color: var(--oryx-color-neutral-1);
    border-radius: 2px;
    aspect-ratio: 1 / 1;
  }

  input {
    cursor: pointer;
    appearance: none;
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
    margin: 0;
    border-radius: inherit;
    outline-offset: 4px;
    outline-style: solid;
    outline-width: 2px;
  }

  input:not(:focus-visible) {
    outline: none;
  }

  input:focus:not(:focus-visible) {
    border: 1px solid var(--oryx-color-primary-9);
    box-shadow: 0 0 4px var(--oryx-color-focus);
  }

  .navigation oryx-product-media {
    display: flex;
    align-items: center;
    height: 100%;
  }
`;
