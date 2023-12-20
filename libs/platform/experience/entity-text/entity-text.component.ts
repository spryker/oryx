import { EntityService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LinkService } from '@spryker-oryx/router';
import { TextMixin } from '@spryker-oryx/ui/text';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive';
import { UnsafeHTMLDirective } from 'lit/directives/unsafe-html';
import { html } from 'lit/static-html.js';
import { catchError, of, switchMap } from 'rxjs';
import { EntityTextOptions } from './entity-text.model';

@hydrate()
export class EntityTextComponent extends TextMixin(
  ContentMixin<EntityTextOptions>(LitElement)
) {
  protected entityService = resolve(EntityService);
  protected linkService = resolve(LinkService);

  protected $data = computed<string | undefined>(() => {
    const { entity: type, field } = this.$options();
    return this.entityService
      .getField<string>({ element: this, type, field })
      .pipe(catchError(() => of()));
  });

  protected $text = computed(() => {
    const text = this.$data();
    if (!text) return;
    return this.convertText(text);
  });

  protected $link = computed(() => {
    const { entity: type } = this.$options();

    return this.entityService.getQualifier({ element: this, type }).pipe(
      switchMap(({ type, qualifier }) => {
        console.log(qualifier, type);
        return this.linkService.get({
          type,
          qualifier,
        });
      }),
      catchError(() => of())
    );
  });

  protected override render(): TemplateResult | void {
    const content = this.renderContent();
    const { tag } = this.$options();
    return tag && content
      ? html`<oryx-heading .tag=${tag}>${content}</oryx-heading>`
      : content;
  }

  protected renderContent(): TemplateResult | void {
    const text = this.$text();
    if (!text) return;
    const { link } = this.$options();
    return html`${this.renderPrefix()}${link
      ? this.renderLink()
      : this.$text()} `;
  }

  protected renderLink():
    | TemplateResult
    | DirectiveResult<typeof UnsafeHTMLDirective>
    | void {
    const text = this.$text();
    const link = this.$link();
    console.log(link);

    if (!link) return text;

    return html` <oryx-link><a href=${this.$link()}>${text}</a> </oryx-link> `;
  }

  protected renderPrefix(): TemplateResult | void {
    const { prefix } = this.$options();
    if (!prefix) return;
    return html`<span part="prefix" styling="padding-inline-end: 8px;"
      >${prefix}</span
    >`;
  }
}
