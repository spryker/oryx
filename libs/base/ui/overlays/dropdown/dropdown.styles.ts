import { featureVersion } from '@spryker-oryx/utilities';
import { css, unsafeCSS as unsafecss } from 'lit';
import { POPOVER_HEIGHT } from '../popover';
import { Position } from './dropdown.model';

export const dropdownBaseStyles = css`
  :host {
    --oryx-popover-top-space: 4px;
    --oryx-popover-vertical-offset: 10px;
    --oryx-popover-maxwidth: 206px;

    position: relative;
    display: inline-flex;
  }

  oryx-popover {
    --_oryx-dropdown-start-offset: 100%;
    --_oryx-dropdown-width: min(
      max(
        var(--_available-popover-width-start, var(--oryx-popover-maxwidth)),
        var(--_available-popover-width-end, var(--oryx-popover-maxwidth))
      ),
      var(--oryx-popover-maxwidth)
    );

    ${featureVersion >= '1.4'
      ? css``
      : css`
          z-index: 100;
        `}

    overflow: auto;
    max-height: min(
      calc(
        var(--_available-popover-height, ${unsafecss(POPOVER_HEIGHT)}px) +
          var(--_bounding-element-height, 0)
      ),
      var(--oryx-popover-maxheight, ${unsafecss(POPOVER_HEIGHT)}px)
    );
    width: var(--_oryx-dropdown-width);
    inset-block-start: 0;
    inset-inline: var(--_oryx-dropdown-start-offset, auto)
      var(--_oryx-dropdown-end-offset, auto);
    transform-origin: var(--_dropdown-origin-x, left)
      var(--_dropdown-origin-y, top);

    ${featureVersion >= `1.3`
      ? css``
      : css`
          transform: scaleX(var(--oryx-popover-visible, 0))
            scaleY(var(--oryx-popover-visible, 0));
        `}
  }

  ${featureVersion >= `1.3`
    ? css`
        :host(:not([vertical-align])) oryx-popover {
          transform: scaleX(var(--oryx-popover-visible, 0))
            scaleY(var(--oryx-popover-visible, 0));
        }
      `
    : css``}

  slot[name='trigger'] {
    cursor: pointer;
  }

  :host([start]:not([rtl])),
  :host([end][rtl]),
  :host([rtl]:not([position=${unsafecss(Position.START)}]):not([start])),
  :host([position=${unsafecss(Position.START)}]) {
    --_dropdown-origin-x: right;
  }

  :host([end]:not([rtl])),
  :host([start][rtl]),
  :host([rtl][position=${unsafecss(Position.START)}]:not([end])),
  :host(:not([position=${unsafecss(Position.START)}])) {
    --_dropdown-origin-x: left;
  }

  :host(:not([up])) {
    --_dropdown-origin-y: top;
  }

  :host([up]) {
    --_dropdown-origin-y: bottom;
  }

  :host([start]:not([vertical-align])) oryx-popover,
  :host(
    [position=${unsafecss(Position.START)}]:not([vertical-align]):not([end])
  ) oryx-popover {
    --_oryx-dropdown-start-offset: auto;
    --_oryx-dropdown-end-offset: 100%;
  }

  :host([up]:not([vertical-align])) oryx-popover {
    inset-block: auto 0;
  }

  :host([vertical-align]:not([up])) oryx-popover {
    inset-block-start: calc(100% + var(--oryx-popover-top-space));
  }

  :host([vertical-align][up]) oryx-popover {
    inset-block: auto 100%;
  }

  :host([vertical-align]) oryx-popover {
    --_oryx-dropdown-width: min(
      calc(
        var(--_available-popover-width-start) +
          var(--_available-popover-width-end) +
          var(--_bounding-element-width, 0)
      ),
      calc(var(--oryx-popover-maxwidth))
    );

    max-height: min(
      var(--_available-popover-height, ${unsafecss(POPOVER_HEIGHT)}px),
      var(--oryx-popover-maxheight, ${unsafecss(POPOVER_HEIGHT)}px)
    );

    ${featureVersion >= `1.3`
      ? css``
      : css`
          transform: scaleY(var(--oryx-popover-visible, 0));
        `}
  }

  :host([vertical-align][position=${unsafecss(Position.END)}]) oryx-popover,
  :host(
    [vertical-align][position=${unsafecss(Position.START)}][end]
  ) oryx-popover {
    --_oryx-dropdown-start-offset: min(
      calc(
        var(--_available-popover-width-end) + var(--_bounding-element-width) -
          var(--_oryx-dropdown-width)
      ),
      0px
    );
    --_oryx-dropdown-end-offset: auto;
  }

  :host(
    [vertical-align][position=${unsafecss(Position.START)}]
  ) oryx-popover,
  :host(
    [vertical-align][start]:not([position])
  ) oryx-popover,
  :host(
    [vertical-align][start][position=${unsafecss(Position.END)}]
  ) oryx-popover {
    --_oryx-dropdown-start-offset: auto;
    --_oryx-dropdown-end-offset: min(
      calc(
        var(--_available-popover-width-start) + var(--_bounding-element-width) -
          var(--_oryx-dropdown-width)
      ),
      0px
    );
  }

  :host([vertical-align][position=${unsafecss(Position.CENTER)}]) oryx-popover {
    --_dropdown-origin-x: center;
  }

  :host(
    [vertical-align][position=${unsafecss(Position.CENTER)}]:not([start])
  ) oryx-popover {
    --_oryx-dropdown-start-offset: max(
      calc(
        (var(--_oryx-dropdown-width) - var(--_bounding-element-width, 0)) / -2
      ),
      calc(var(--_available-popover-width-start) * -1)
    );
    --_oryx-dropdown-end-offset: auto;
  }

  :host(
    [vertical-align][position=${unsafecss(Position.CENTER)}][start]
  ) oryx-popover {
    --_oryx-dropdown-start-offset: auto;
    --_oryx-dropdown-end-offset: max(
      calc(
        (var(--_oryx-dropdown-width) - var(--_bounding-element-width, 0)) / -2
      ),
      calc(var(--_available-popover-width-end) * -1)
    );
  }
`;
