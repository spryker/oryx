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
      background-color: var(--oryx-color-divider, var(--oryx-color-canvas-500));
    }

    :host(:not([vertical]):not([class*='vertical']))
      *:not(:first-child)::before,
    :host(:not([vertical]):not([class*='vertical']))
      ::slotted(*:not(:first-child))::before {
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

    :host([vertical]) *:not(:first-child)::before,
    :host([vertical]) ::slotted(*:not(:first-child))::before,
    :host([class*='vertical']) *:not(:first-child)::before,
    :host([class*='vertical']) ::slotted(*:not(:first-child))::before {
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
