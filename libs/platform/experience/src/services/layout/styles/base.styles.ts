import { css } from 'lit';

export const styles = css`
  :host {
    --_container-width: min(
      var(--oryx-container-width),
      calc(100vw - (2 * var(--oryx-container-bleed, 0px)))
    );

    width: min(100%, calc(var(--_container-width)));
    display: grid;
    margin-inline: auto;
    gap: var(--oryx-grid-gap-row) var(--oryx-grid-gap-column);
  }
`;
