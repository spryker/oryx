import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { getControl } from '../util';
import { LabelOptions } from './label.model';

export class LabelController implements ReactiveController {
  protected isRequired?: boolean;

  render(): TemplateResult {
    return html` <slot name="label">${this.renderLabel()}</slot> `;
  }

  hostConnected?(): void;

  hostUpdated(): void {
    this.host.toggleAttribute('has-label', !!this.host.label);
    const isRequired = this.control.required;
    if (isRequired !== this.isRequired) {
      this.isRequired = isRequired;
      this.host.requestUpdate('label');
    }
  }

  protected renderLabel(): TemplateResult {
    const asterisk =
      !!this.host.label &&
      this.isRequired &&
      this.host.label.charAt(this.host.label.length - 1)
        ? '*'
        : '';
    return this.host.label
      ? html`<div>${this.host.label}${asterisk}</div>`
      : html``;
  }

  protected get control():
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement {
    return getControl(this.host);
  }

  constructor(protected host: LabelOptions & LitElement) {
    this.host.addController(this);
  }
}
