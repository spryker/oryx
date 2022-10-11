import { css } from 'lit';

/**
 * Provides a capability to add container to the layout. A container is a centered area on the page that will
 * not let it's children render outside the area. The container width is limited to either 100% of the available
 * space or a global container width (using `--oryx-container-width`).
 *
 * When the container is combined with a jumbotron (spanning the full width), the container margins are mimic with
 * a padding. Please note that this is not bullet proof, as it can cause issues with:
 * - additional composition padding
 * - overflowing of carousel items in the jumbotron space
 */
export const containerLayoutStyles = css`
  :host([class*='-container']:not([class*='-jumbotron'])) {
    margin: auto;
    max-width: min(100%, var(--oryx-container-width));
  }

  :host([class*='-container'][class*='-has-margin']:not([class*='-jumbotron'])) {
    margin: var(--oryx-layout-margin, 0px)
      calc(
        (100% - min(var(--oryx-container-width), 100%)) / 2 +
          (2 * var(--oryx-layout-margin, 0px))
      );
  }

  :host([class*='-container'][class*='-jumbotron'][class*='-has-margin']) {
    padding-inline: calc(
      ((100% - var(--oryx-container-width)) / 2) +
        (2 * var(--oryx-layout-margin, 0px))
    );
  }

  :host([class*='-container'][class*='-jumbotron']) {
    padding-inline: calc((100% - var(--oryx-container-width)) / 2);
  }
`;
