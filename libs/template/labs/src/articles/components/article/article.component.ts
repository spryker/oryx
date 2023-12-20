import { ContentContext, ContentService } from '@spryker-oryx/content';
import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  computed,
  hydrate,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { of } from 'rxjs';
import { ArticleContent } from '../../article.model';

@signalAware()
@hydrate()
export class ArticleComponent extends LitElement {
  protected contentService = resolve(ContentService);
  protected contextController = new ContextController(this);

  protected $articleQualifier = signal(
    this.contextController.get(ContentContext.Content)
  );

  protected $data = computed(() => {
    const qualifier = this.$articleQualifier();
    const id = qualifier?.id;
    const type = qualifier?.type;

    return id && type
      ? this.contentService.get<ArticleContent>({
          id,
          type,
          entities: [type],
        })
      : of(null);
  });

  protected override render(): TemplateResult | void {
    const data = this.$data();

    if (!data?.content) {
      return;
    }

    return html`<oryx-content-text
      .content=${{ text: data.content }}
    ></oryx-content-text> `;
  }
}
