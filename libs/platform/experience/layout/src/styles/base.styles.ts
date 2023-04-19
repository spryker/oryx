import { css } from 'lit';

export const styles = css`
  :host {
    --col-span: 1;
    --row-span: 1;
    --_container-width: min(
      var(--oryx-container-width),
      calc(100vw - (2 * var(--oryx-container-bleed, 0px)))
    );
    --_item-size: var(
      --oryx-grid-item-size,
      min(
        100%,
        calc(
          (
              var(--_container-width) -
                (var(--oryx-grid-gap-column) * (var(--oryx-grid-columns) - 1))
            ) / var(--oryx-grid-columns) - var(--padding, 0px)
        )
      )
    );

    display: grid;
    gap: var(--oryx-grid-gap-row) var(--oryx-grid-gap-column);
    align-items: start;
    align-content: start;
    max-width: 100%;
    max-height: 100%;
    width: min(100%, calc(var(--_container-width)));
    margin-inline: auto;
  }

  *,
  ::slotted(*) {
    --col-span: 1;
    --row-span: 1;

    padding: var(--padding);
    margin: var(--margin);
    grid-column: var(--col-pos, auto) / span var(--col-span);
    grid-row: var(--row-pos, auto) / span var(--row-span);
    max-width: calc(100% - (var(--margin, 0px) * 2));
    max-height: calc(100% - (var(--margin, 0px) * 2));
    box-sizing: border-box;
  }
`;
