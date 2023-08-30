import { css } from 'lit';

export const siteBreadcrumbStyles = css`
  :host {
    display: flex;
    align-items: center;
    gap: 0 8px;
    flex-wrap: wrap;
  }

  oryx-button {
    max-width: var(--oryx-breadcrumb-max-width, 480px);
  }

  oryx-button::part(button) {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
