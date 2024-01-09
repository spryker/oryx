import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const commonStyle = css`
  :host {
    --_divider: var(--oryx-divider-width, 1px) var(--oryx-divider-style, solid)
      var(--oryx-divider-color, var(--oryx-color-neutral-6));
  }

  *:not(:first-child),
  ::slotted(*:not(:first-child)) {
    position: relative;
  }

  *:not(:first-child)::before,
  ::slotted(*:not(:first-child))::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: -1;
  }
`;

export const horizontalInBetweenStyles = css`
  *:not(:first-child)::before,
  ::slotted(*:not(:first-child))::before {
    border-inline-start: var(--_divider);
    transform: translateX(
      calc(
        (
            var(--column-gap, var(--oryx-column-gap, 0px)) +
              var(--oryx-divider-width, 1px)
          ) / -2
      )
    );
  }
`;

export const verticalInBetweenStyles = css`
  *:not(:first-child)::before,
  ::slotted(*:not(:first-child))::before {
    width: 100%;
    border-block-start: var(--_divider);
    transform: translateY(
      calc(
        (
            var(--row-gap, var(--oryx-row-gap, 0px)) +
              var(--oryx-divider-width, 1px)
          ) / -2
      )
    );
  }
`;

export const beforeHorizontalStyles = css`
  :host {
    border-inline-start: var(--_divider);
  }
`;
export const afterHorizontalStyles = css`
  :host {
    border-inline-end: var(--_divider);
  }
`;

export const beforeVerticalStyles = css`
  :host {
    border-block-start: var(--_divider);
  }
`;

export const afterVerticalStyles = css`
  :host {
    border-block-end: var(--_divider);
  }
`;

/**
 * @deprecated since 1.4, use horizontalInBetweenStyles instead
 */
export const styles: LayoutStyles = {
  styles: css`
    :host {
      align-items: var(--align, normal);
    }

    *:not(:first-child),
    ::slotted(*:not(:first-child)) {
      position: relative;
    }

    *:not(:first-child)::before,
    ::slotted(*:not(:first-child))::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: var(--oryx-color-divider, var(--oryx-color-neutral-6));
      width: var(--oryx-divider-width, 1px);
      height: 100%;
      transform: translateX(
        calc(
          (
              var(--column-gap, var(--oryx-column-gap, 0px)) +
                var(--oryx-divider-width, 1px)
            ) / -2
        )
      );
    }
  `,
};

/**
 * @deprecated since 1.4, use verticalInBetweenStyles instead
 */
export const verticalStyles: LayoutStyles = {
  styles: css`
    *:not(:first-child)::before,
    ::slotted(*:not(:first-child))::before {
      width: 100%;
      height: var(--oryx-divider-width, 1px);
      transform: translateY(
        calc(
          (
              var(--row-gap, var(--oryx-row-gap, 0px)) +
                var(--oryx-divider-width, 1px)
            ) / -2
        )
      );
    }
  `,
};
