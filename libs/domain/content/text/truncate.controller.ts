import { LitElement, ReactiveController } from 'lit';
import { TextAttributes } from './text.model';

export class TruncationController implements ReactiveController {
  constructor(protected host: LitElement & TextAttributes) {
    this.host.addController(this);
  }

  hostConnected?(): void;

  hostUpdated(): void {
    this.toggleLineHeight();
  }

  /**
   * By default, the css provides a max-height to avoid that the given (static)
   * max lines is larger than the actual text height. The max-height, however,
   * does not work in css transitions, which is why we replace the `max-height` with
   * `height`.
   */
  protected toggleLineHeight(): void {
    if (this.host.toggle === undefined) return;

    if (
      this.host.scrollHeight > this.host.clientHeight &&
      this.host.style.maxHeight !== 'initial'
    ) {
      this.host.style.maxHeight = 'initial';
      this.host.style.height =
        'calc(var(--oryx-typography-line, 1rem) * var(--max-lines))';
    }

    // this code should not run on the server
    const lines = window
      .getComputedStyle(this.host)
      .getPropertyValue('--max-lines');

    const totalLines =
      this.host.scrollHeight / (this.host.offsetHeight / Number(lines));

    this.host.style.setProperty(
      '--max-lines',
      this.host.toggle
        ? totalLines.toString()
        : this.host.lines?.toString() ?? 'initial'
    );
  }
}
