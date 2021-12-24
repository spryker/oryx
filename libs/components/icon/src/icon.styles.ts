import { css } from 'lit';

export const styles = css`
  :host {
    height: var(
      --icon-size,
      var(--oryx-icon-size-default, var(--oryx-icon-size-large), 24px)
    );
    aspect-ratio: 1 / 1;
  }

  svg {
    fill: currentColor;
    width: var(--icon-size, 24px);
    aspect-ratio: 1 / 1;
  }

  :host([size='large']) {
    --icon-size: var(--oryx-icon-size-large, 24px);
  }
  :host([size='medium']) {
    --icon-size: var(--oryx-icon-size-medium, 18px);
  }
  :host([size='small']) {
    --icon-size: var(--oryx-icon-size-small, 12px);
  }
`;
