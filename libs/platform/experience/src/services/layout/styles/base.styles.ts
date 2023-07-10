import { css } from 'lit';

export const styles = css`
  :host {
    --_container-width: min(
      var(--oryx-container-width),
      calc(100vw - (2 * var(--oryx-container-bleed, 0px)))
    );

    display: grid;
    column-gap: var(--column-gap, var(--oryx-column-gap, 0));
    row-gap: var(--row-gap, var(--oryx-row-gap));
    margin-inline: auto;
    width: min(100%, calc(var(--_container-width)));
  }

  *,
  ::slotted(*) {
    transition: all var(--oryx-transition-time);
  }
`;
