import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  styles: css`
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
    }

    :host(:not([layout-vertical])) *:not(:first-child)::before,
    :host(:not([layout-vertical])) ::slotted(*:not(:first-child))::before {
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

    :host([layout-vertical]) *:not(:first-child)::before,
    :host([layout-vertical]) ::slotted(*:not(:first-child))::before {
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
