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
                (
                  var(--column-gap, var(--oryx-grid-gap-column, 0px)) *
                    (var(--oryx-grid-columns) - 1)
                )
            ) / var(--oryx-grid-columns) - var(--nested-padding, 0px)
        )
      )
    );

    max-width: 100%;
    max-height: 100%;
    align-items: start;
    align-content: start;
  }

  *,
  ::slotted(*) {
    max-width: calc(100% - (var(--margin, 0px) * 2));
    max-height: calc(100% - (var(--margin, 0px) * 2));
    box-sizing: border-box;
  }
`;
