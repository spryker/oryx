import { LitElement, ReactiveController } from 'lit';

export class CollapseToggleController implements ReactiveController {
  protected isCollapsed = true;

  constructor(protected host: LitElement) {
    this.host.addController(this);
  }

  toggle(): void {
    this.host.toggleAttribute('collapsed');
  }

  hostConnected(): void {
    this.host.toggleAttribute('collapsed', this.isCollapsed);

    window.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (!this.isTyping(ev) && ev.key === '[') {
        this.toggle();
      }
    });
  }

  protected isTyping(ev: KeyboardEvent): boolean {
    return ['INPUT'].includes((ev.target as HTMLElement).tagName);
  }
}
