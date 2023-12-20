import { EntityService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { catchError, of } from 'rxjs';
import { EntityLinkOptions } from './entity-link.model';

@hydrate()
export class EntityLinkComponent extends ContentMixin<EntityLinkOptions>(
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
      <oryx-link .icon=${icon}>
        <a .href=${this.resolveProtocol(link)}>${label ?? link}</a>
      </oryx-link>
    `;
  }

  /**
   * Resolves the protocol for the given url, in case it's a phone number or email address.
   * Phone numbers will get the `tel:` protocol, email addresses the `mailto:` protocol.
   */
  protected resolveProtocol(url: string): string {
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9()]*$/im;

    if (phoneRegex.test(url)) return `tel:${url}`;

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/im;
    if (emailRegex.test(url)) return `mailto:${url}`;

    return url;
  }
}
