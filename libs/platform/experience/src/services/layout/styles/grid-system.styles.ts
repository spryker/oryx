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
                  var(--column-gap, var(--oryx-column-gap, 0px)) *
                    (var(--oryx-column-count, var(--oryx-column-base)) - 1)
                )
            ) / var(--oryx-column-count, var(--oryx-column-base)) -
            var(--_np, 0px)
        )
      )
    );

    display: grid;
    max-width: 100%;
    max-height: 100%;
  }

  :host(:not([layout-vertical])) {
    place-content: var(--align, start) var(--justify);
    place-items: var(--align, start) var(--justify);
  }

  *,
  ::slotted(*) {
    place-self: var(--align) var(--justify);
  }

  *:not(style),
  ::slotted(*:not(style)) {
    --_np: var(--inline-padding);

    max-width: calc(100% - (var(--margin, 0px) * 2));
    max-height: calc(100% - (var(--margin, 0px) * 2));
    box-sizing: border-box;
  }
`;
