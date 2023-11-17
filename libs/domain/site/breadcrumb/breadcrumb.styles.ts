import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const siteBreadcrumbStyles = css`
  :host {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  :host > :not(oryx-icon) {
    text-decoration: none;
    color: var(--oryx-color-neutral-12);
    max-width: var(--oryx-breadcrumb-max-width, 480px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  a:hover {
    color: var(--oryx-color-primary-10);
  }

  :host > span {
    color: var(--oryx-color-neutral-9);
  }
`;

export const screenStyles = screenCss({
  sm: css`
    :host {
      display: none;
    }
  `,
});
