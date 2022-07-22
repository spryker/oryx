import { LitElement, ReactiveController } from 'lit';

export class ScrollingAreaController implements ReactiveController {
  hostConnected?(): void;

  constructor(protected host: LitElement) {
    this.host.addController(this);
  }

  setScrollAttributes(scrollContainer: HTMLElement | null): void {
    if (!scrollContainer) {
      this.host.removeAttribute('scrollable-top');
      this.host.removeAttribute('scrollable-bottom');
      return;
    }

    const { height } = scrollContainer.getBoundingClientRect();

    this.host.toggleAttribute(
      'scrollable-top',
      !!Math.ceil(scrollContainer.scrollTop)
    );
    this.host.toggleAttribute(
      'scrollable-bottom',
      scrollContainer.scrollHeight >
        Math.ceil(height + scrollContainer.scrollTop)
    );
  }
}
