import { ArticleContext, ContentService } from '@spryker-oryx/content';
import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import {
  computed,
  hydratable,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { of } from 'rxjs';
import { ContentArticleOptions } from './article.model';

// Temporary implementation ContentFields
@signalAware()
@hydratable()
export class ArticleComponent extends ContentMixin<ContentArticleOptions>(
  LitElement
) {
  protected contentService = resolve(ContentService);
  protected contextController = new ContextController(this);

  protected $articleContext = signal(
    this.contextController.get<string>(ArticleContext.Id)
  );
  protected $article = computed(() => {
    const article = this.$articleContext();

    return article
      ? this.contentService.get({ article, entries: this.$options().entries })
      : of(null);
  });

  protected override render(): TemplateResult {
    return html`${this.$article()?.article}`;
  }
}
