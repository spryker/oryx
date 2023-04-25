import { css } from 'lit';

export const colorPaletteStyles = css`
  :host {
    --gap: 1px;
  }

  section {
    display: grid;
    gap: var(--gap, 0);
    grid-auto-rows: 50px;
  }

  section[layout='grid'] {
    grid-template-columns: repeat(
      12,
      min(calc((100% / 12) - var(--gap, 0)), 50px)
    );
  }

  /* section[list] {
    grid-auto-rows: 50px;
  } */

  label {
    border: none;
    margin: 0;
    padding: 0;
    /* box-sizing: border-box; */
    width: 100%;
    /* aspect-ratio: 4/3; */
    /* height: 50px; */
    cursor: pointer;
  }

  h3 {
    grid-column: 1 / span 12;
  }

  oryx-swatch {
    margin: 0;
    border-radius: 0;
    width: 100%;
    height: 100%;
    outline: 0;
  }

  oryx-swatch.selected {
    width: 200px;
    height: 50px;
  }

  oryx-swatch + input {
    appearance: none;
    position: absolute;
  }
`;
