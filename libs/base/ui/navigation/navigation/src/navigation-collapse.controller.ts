import { LitElement, ReactiveController } from 'lit';

export class CollapseToggleController implements ReactiveController {
  protected isCollapsed = true;

  constructor(protected host: LitElement) {
    this.host.addController(this);
  }

  hostConnected(): void {
    this.toggle(this.isCollapsed);

    window.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (!this.isTyping(ev) && ev.key === '[') this.toggle();
    });
  }

  toggle(force?: boolean): void {
    this.host.toggleAttribute('collapsed', force);
    document.body.style.setProperty(
      '--navigation-collapsed',
      this.host.hasAttribute('collapsed') ? '1' : '0'
    );
  }

  protected isTyping(ev: KeyboardEvent): boolean {
    return ['INPUT'].includes((ev.target as HTMLElement).tagName);
  }
}
