import { css } from 'lit';

export const styles = css`
  section {
    padding: 24px 16px 0;
    display: grid;
    gap: 25px;
  }

  oryx-picking-lists-header {
    position: sticky;
    inset-block-start: 0;
  }

  .no-items-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    margin: 45px;
    gap: 16px;
  }

  oryx-image {
    margin-inline: 40px;
    display: block;
  }
`;
