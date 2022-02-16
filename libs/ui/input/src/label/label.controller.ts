import { html, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { OryxElement } from '../../../utilities';
import { getControl } from '../util';
import { LabelOptions } from './label.model';

export class LabelController implements ReactiveController {
  constructor(protected host: OryxElement<LabelOptions>) {
    this.host.addController(this);
  }

  hostConnected?(): void;

  protected isRequired?: boolean;

  render(): TemplateResult {
    return this.label
      ? html`<label
          >${this.label}${when(
            this.isRequired,
            () => html`<sup>*</sup>`
          )}</label
        >`
      : html``;
  }

  hostUpdated(): void {
    const isRequired = getControl(this.host)?.required;
    if (isRequired !== this.isRequired) {
      this.isRequired = isRequired;
      this.host.requestUpdate();
    }
  }

  protected get label(): string | undefined {
    return this.host.options.label;
  }
}
