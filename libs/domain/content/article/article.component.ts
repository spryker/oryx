import { ArticleContext, ContentService } from '@spryker-oryx/content';
import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { computed, signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { of } from 'rxjs';

// Temporary implementation
@signalAware()
export class ArticleComponent extends LitElement {
  protected contentService = resolve(ContentService);
  protected contextController = new ContextController(this);

  protected $articleContext = signal(
    this.contextController.get<string>(ArticleContext.Id)
  );
  protected $article = computed(() => {
    const id = this.$articleContext();
    return id ? this.contentService.get({ article: id }) : of(null);
  });

  protected override render(): TemplateResult {
    return html`${this.$article()?.article}`;
  }
}
