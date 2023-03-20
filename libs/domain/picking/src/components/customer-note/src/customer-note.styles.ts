import { css } from 'lit';

export const styles = css`
  :host {
    padding: 30px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  section {
    position: sticky;
    top: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  oryx-navigate-back {
    align-self: flex-start;
    margin-bottom: 40px;
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
    bottom: 30px;
  }
`;
