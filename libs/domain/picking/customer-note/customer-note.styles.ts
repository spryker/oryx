import { css } from 'lit';

export const customerNoteComponentStyles = css`
  :host {
    padding: 30px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    box-sizing: border-box;
  }

  section {
    position: sticky;
    inset-block-start: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  oryx-picking-navigate-back {
    align-self: flex-start;
    margin-block-end: 40px;
  }

  oryx-image {
    max-width: 250px;
    max-height: 250px;
    display: block;
    margin: 0 auto;
  }

  oryx-heading {
    margin: 50px 0 20px;
  }

  p {
    flex-grow: 1;
    overflow-y: auto;
    margin: 0 0 30px;
  }

  oryx-button {
    position: sticky;
    inset-block-end: 30px;
  }

  oryx-modal oryx-heading {
    margin: 0;
  }
`;
