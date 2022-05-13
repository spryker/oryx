import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    position: relative;
  }

  .preview {
    overflow: hidden;
  }

  .preview img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .preview-container {
    width: 100%;
    height: var(--preview-height, 300px);
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    display: flex;
    background-color: var(--oryx-color-neutral-dark, gray);
    scrollbar-width: none; /* Firefox */
  }

  .preview-container::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .preview-item {
    flex: 1 0 100%;
    scroll-snap-align: start;
    padding: var(--preview-padding, 24px);
    box-sizing: border-box;

    /* Prevents collapsing for elements with 0 height */
    min-height: 1px;
  }

  .thumbs {
    inset: 0 auto 0 var(--oryx-space-4, 20px);
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--thumb-gap, --oryx-space-2);
  }

  .thumb {
    display: flex;
    border: var(--oryx-border-thin) solid var(--oryx-color-neutral-darker);
    cursor: pointer;
    opacity: 50%;
    transition: all 0.35s ease;
    padding: 0;
    transition-property: opacity, border-color;
  }

  .thumb > img {
    object-fit: cover;
    width: var(--thumb-width, 32px);
    height: var(--thumb-height, 32px);
  }

  .thumb:hover,
  .thumb.active {
    opacity: 100%;
    border-color: white;
  }

  @media (min-width: 1024px) {
    .preview-item {
      position: absolute;
      inset: 0;
      opacity: 0%;
      transition: opacity var(--oryx-transition-time) ease;
    }
    .preview-item.active {
      opacity: 100%;
    }
  }
`;
