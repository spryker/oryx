import { css } from 'lit';

export const styles = css`
  :host {
    position: relative;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .preview {
    overflow: hidden;
  }

  .preview-container {
    display: flex;
    flex-grow: 1;
    position: relative;
    height: 400px;
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    background-color: var(--oryx-color-neutral-dark);
  }

  .preview-container::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .preview-item {
    flex-grow: 1;
    scroll-snap-align: start;
  }

  @media (min-width: 1024px) {
    .preview-item {
      position: absolute;
      inset: 0;
    }
  }
`;
