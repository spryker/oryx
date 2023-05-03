import { css } from 'lit';

export const styles = css`
  *,
  ::slotted(*) {
    scroll-snap-align: start;
  }
`;
