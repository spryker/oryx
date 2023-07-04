import {
  ArticleContext,
  ContentFields,
  ContentService,
} from '@spryker-oryx/content';
import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  computed,
  hydratable,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { marked } from 'marked';
import { of } from 'rxjs';
import { ContentArticleOptions } from './article.model';

@defaultOptions({ entities: [ContentFields.Article, ContentFields.Faq] })
@signalAware()
@hydratable()
export class ArticleComponent extends ContentMixin<ContentArticleOptions>(
  LitElement
) {
  protected contentService = resolve(ContentService);
  protected contextController = new ContextController(this);

  protected $articleId = signal(
    this.contextController.get<string>(ArticleContext.Id)
  );
  protected $articleType = signal(
    this.contextController.get<string>(ArticleContext.Type)
  );

  protected $data = computed(() => {
    const { entities } = this.$options();
    const id = this.$articleId();
    const type = this.$articleType();

    return id && type
      ? this.contentService.get({ id, type, entities })
      : of(null);
  });

  protected override render(): TemplateResult | void {
    const data = this.$data();

    if (!data?.content) {
      return;
    }

    return html`<oryx-text
      .content=${marked.parse(data.content)}
    ></oryx-text> `;
  }
}
