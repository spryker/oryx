import { css, unsafeCSS as unsafecss } from 'lit';
import { Position } from '../../../../utilities';
import { POPOVER_HEIGHT } from '../../../popover';

export const dropdownBaseStyles = css`
  :host {
    --oryx-popover-vertical-offset: 10px;
    --oryx-popover-maxwidth: 206px;

    position: relative;
    display: inline-flex;
  }

  oryx-popover {
    overflow: auto;
    max-height: min(
      calc(
        var(--_available-popover-height, ${unsafecss(POPOVER_HEIGHT)}px) +
          var(--_bounding-element-height, 0)
      ),
      var(--oryx-popover-maxheight, ${unsafecss(POPOVER_HEIGHT)}px)
    );
    width: min(
      var(--_available-popover-width, var(--oryx-popover-maxwidth)),
      var(--oryx-popover-maxwidth)
    );
    top: 0;
    inset-inline-start: 100%;
    transform-origin: var(--_dropdown-origin-x, left)
      var(--_dropdown-origin-y, top);
    transform: scaleX(var(--oryx-popover-visible, 0))
      scaleY(var(--oryx-popover-visible, 0));
  }

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

  :host([start]) oryx-popover,
  :host(
    [position=${unsafecss(Position.START)}]:not([end])
  ) oryx-popover {
    inset-inline: auto 100%;
  }

  :host([up]) oryx-popover {
    top: auto;
    bottom: 0;
  }
`;
