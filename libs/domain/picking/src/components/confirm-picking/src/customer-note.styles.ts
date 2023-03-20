import { css } from 'lit';

export const styles = css`
  :host {
    padding: 0 30px;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  section {
    padding-top: 30px;
    position: sticky;
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  oryx-navigate-back {
        align-self: flex-start;
      margin-bottom: 38px;
    }

    oryx-image {
        max-width: 250px;
        max-height: 250px;
        display: block;
        margin: 0 auto;
    }

    oryx-heading {
      margin: 50px 0 20px;
      /* font-size: 18px;
      line-height: 26px; */
    }

    p {
    flex-grow: 1;
    overflow-y: auto;
    line-height: 1.857em;
    margin: 0;
  }

  oryx-button {
    position: sticky;
    bottom: 0;
    padding: 30px 0;
  }
`;
