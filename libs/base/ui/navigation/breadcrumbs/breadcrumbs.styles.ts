import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const breadcrumbsStyles = css`
  :host {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  ::slotted(oryx-icon) {
    --oryx-icon-size: 12px;
    --_margin: 0;
  }

  ::slotted(:not(oryx-icon)) {
    text-decoration: none;
    color: var(--oryx-color-neutral-12);
    max-width: var(--oryx-breadcrumb-max-width, 480px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  ::slotted(a:hover) {
    color: var(--oryx-color-primary-10);
  }

  ::slotted(:is([disabled], :last-child)) {
    color: var(--oryx-color-neutral-9);
    pointer-events: none;
  }
`;

const smallScreen = css`
  :host {
    display: none;
  }
`;

export const screenStyles = screenCss({
  sm: smallScreen,
});
