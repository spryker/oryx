import { OryxElement } from '../../../utilities';
import { getControl } from '../util';
import { LabelOptions } from './label.model';
import { html, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';

export class LabelController implements ReactiveController {
  protected isRequired?: boolean;

  render(): TemplateResult {
    return html`
      <slot name="label">
        ${when(this.label, () => html`<div>${this.label}</div> `)}
      </slot>
    `;
  }

  hostConnected?(): void;

  hostUpdated(): void {
    this.host.toggleAttribute('has-label', !!this.label);
    const isRequired = getControl(this.host)?.required;
    if (isRequired !== this.isRequired) {
      this.isRequired = isRequired;
      this.host.requestUpdate('options');
    }
  }

  protected get label(): string | undefined {
    const label = this.host.options.label;
    return !!label && this.isRequired && label.charAt(label.length - 1)
      ? label + '*'
      : label;
  }

  constructor(protected host: OryxElement<LabelOptions>) {
    this.host.addController(this);
  }
}
