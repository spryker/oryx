import { css } from 'lit';

export const fullscreenModalStyles = css`
  :host([fullscreen]) dialog {
    width: 100%;
    max-width: 100%;
    max-height: 100vh;
  }

  :host([fullscreen]) oryx-card {
    --oryx-card-border-radius: 0;

    height: 100vh;
    max-height: 100vh;
  }

  :host([fullscreen]) oryx-card::part(body) {
    height: 100%;
  }
`;
