import { LitElement, ReactiveController } from 'lit';
import { FormMixinProperties, SUBMIT_EVENT } from '../models';

export class FormController implements ReactiveController {
  constructor(protected host: LitElement & FormMixinProperties) {
    this.host.addController(this);

    this.onSubmit = this.onSubmit.bind(this);
  }

  async hostConnected(): Promise<void> {
    //simulate first updated hook
    this.host.requestUpdate();
    await this.host.updateComplete;

    this.host.getForm()?.addEventListener('submit', this.onSubmit);
  }

  hostDisconnected(): void {
    this.host.getForm()?.removeEventListener('submit', this.onSubmit);
  }

  protected onSubmit(e: Event): void {
    e.preventDefault();

    const values = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries()
    );

    this.host.dispatchEvent(
      new CustomEvent(SUBMIT_EVENT, {
        composed: true,
        bubbles: true,
        detail: { values },
      })
    );
  }
}
