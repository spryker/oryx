import { EntityService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ActionType } from '@spryker-oryx/ui/action';
import {
  computed,
  emailRegex,
  hydrate,
  phoneRegex,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { catchError, of } from 'rxjs';
import { DataLinkComponentOptions } from './data-link.model';

@hydrate()
export class DataLinkComponent extends ContentMixin<DataLinkComponentOptions>(
  LitElement
) {
  protected entityService = resolve(EntityService);

  protected $data = computed<string | undefined>(() => {
    const { entity: type, field } = this.$options();
    return this.entityService
      .getField<string>({ element: this, type, field })
      .pipe(catchError(() => of()));
  });

  protected override render(): TemplateResult | void {
    const link = this.$data();
    if (!link) return;

    const { label, icon } = this.$options();

    return html`
      <oryx-action
        .icon=${icon}
        .type=${ActionType.Text}
        .text=${label ?? link}
        .href=${this.resolveProtocol(link)}
      ></oryx-action>
    `;
  }

  /**
   * Resolves the protocol for the given url, in case it's a phone number or email address.
   * Phone numbers will get the `tel:` protocol, email addresses the `mailto:` protocol.
   */
  protected resolveProtocol(url: string): string {
    if (phoneRegex.test(url)) return `tel:${url}`;
    if (emailRegex.test(url)) return `mailto:${url}`;
    return url;
  }
}
