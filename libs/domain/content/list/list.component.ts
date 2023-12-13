import { ContentContext, ContentService } from '@spryker-oryx/content';
import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import {
  computed,
  hydrate,
  signal,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { of } from 'rxjs';
import { ContentListOptions } from './list.model';

@signalAware()
@hydrate()
export class ContentListComponent extends LayoutMixin(
  ContentMixin<ContentListOptions>(LitElement)
) {
  @signalProperty({ reflect: true }) type?: string;
  @signalProperty({ reflect: true }) query?: string;
  @signalProperty({ reflect: true }) tags?: string;

  protected contentService = resolve(ContentService);
  protected contextController = new ContextController(this);

  protected $context = signal(
    this.contextController.get<ContentListOptions>(ContentContext.Qualifier)
  );

  protected $data = computed(() => {
    const _options = this.$options();
    const options =
      _options.type || _options.query || _options.tags ? _options : undefined;
    const context = this.$context();
    const props =
      this.type || this.query || this.tags
        ? { type: this.type, query: this.query, tags: this.tags }
        : undefined;
    const data = props ?? options ?? context;

    return data
      ? this.contentService.getAll({
          ...(data.type ? { type: data.type, entities: [data.type] } : {}),
          ...(data.query ? { query: data.query } : {}),
          ...(data.tags ? { tags: data.tags } : {}),
        })
      : of(null);
  });

  protected override render(): TemplateResult | void {
    const data = this.$data();

    if (!data?.length) {
      return;
    }

    return this.renderLayout({
      template: html`${data.map(
        ({ _meta: { type, name }, id, heading }) => html`
          <oryx-content-link
            .options=${{ type, id }}
            .content=${{ text: heading ?? name }}
          ></oryx-content-link>
        `
      )}`,
    });
  }
}
