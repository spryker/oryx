import { css } from 'lit';

export const styles = css`
  :host {
    --_container-width: min(
      var(--oryx-container-width),
      calc(100vw - (2 * var(--oryx-container-bleed, 0px)))
    );

    display: grid;
    column-gap: var(--column-gap, var(--oryx-grid-gap-column, 0));
    row-gap: var(--row-gap, var(--oryx-grid-gap-row));
    margin-inline: auto;
  }

  :host(:not([vertical])) {
    width: min(100%, calc(var(--_container-width)));
  }

  :host(:not([howdoesthisnotworkwithout])) {
    align-items: var(--align, start);
    align-content: var(--align, start);
  }
`;
