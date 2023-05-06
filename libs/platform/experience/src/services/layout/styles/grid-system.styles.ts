import { css } from 'lit';

export const gridSystem = css`
  :host {
    --_item-size: var(
      --oryx-grid-item-size,
      min(
        100%,
        calc(
          (
              var(--_container-width) -
                (var(--oryx-grid-gap-column) * (var(--oryx-grid-columns) - 1))
            ) / var(--oryx-grid-columns) - var(--nested-padding, 0px)
        )
      )
    );

    max-width: 100%;
    max-height: 100%;
    width: min(100%, calc(var(--_container-width)));
    align-items: start;
    align-content: start;
  }

  *,
  ::slotted(*) {
    --nested-padding: var(--padding);

    grid-column: var(--col-pos, auto) / span var(--col-span);
    grid-row: var(--row-pos, auto) / span var(--row-span);
    max-width: calc(100% - (var(--margin, 0px) * 2));
    max-height: calc(100% - (var(--margin, 0px) * 2));
    box-sizing: border-box;
  }

  :host,
  ::slotted(*),
  * {
    --col-span: 1;
    --row-span: 1;
  }
`;
