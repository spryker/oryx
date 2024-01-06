import { css } from 'lit';

export const dataListStyles = css`
  oryx-link {
    padding: var(--oryx-content-link-padding);
  }

  oryx-link:hover {
    background-color: var(--oryx-link-hover-background);
    box-shadow: var(--oryx-link-hover-shadow);
  }

  oryx-link:active,
  oryx-link:focus-within {
    background-color: var(--oryx-link-active-background);
    box-shadow: var(--oryx-link-active-shadow);
  }

  oryx-link[current] {
    color: var(--oryx-link-current-color);
    box-shadow: var(--oryx-link-current-shadow);
  }
`;
