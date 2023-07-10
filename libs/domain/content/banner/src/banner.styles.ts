import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    overflow: hidden;
    position: relative;
    color: white;
    width: var(--width);
    height: var(--height);
  }

  a {
    color: var(--oryx-color-primary-0, white);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .overlay {
    position: absolute;
    inset-block-start: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 0 5.5rem;
  }

  h1 {
    font-size: 3.125rem;
    line-height: 3rem;
    font-weight: 500;
    margin-block: 0 1.6875rem;
  }

  h2 {
    font-size: 1.375rem;
    line-height: 1.75rem;
    font-weight: 500;
    margin: 0;
  }
`;
