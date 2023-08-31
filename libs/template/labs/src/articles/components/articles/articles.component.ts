import { ContentService } from '@spryker-oryx/content';
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
import { ArticleContext } from '../../article-context';
import { CmsArticle } from '../../article.model';

@signalAware()
@hydrate()
export class ArticlesComponent extends LitElement {
  protected contentService = resolve(ContentService);
  protected contextController = new ContextController(this);

  protected $articleType = signal(
    this.contextController.get<string>(ArticleContext.Type)
  );

  protected $data = computed(() => {
    const type = this.$articleType();

    return type ? this.contentService.getAll<CmsArticle>({ type }) : of(null);
  });

  protected override render(): TemplateResult | void {
    const data = this.$data();

    if (!data?.length) {
      return;
    }

    return html`${data.map(
      ({ fields: { type, id, url, heading: text } }) => html`
        <div>
          <oryx-content-link
            .options=${{ type, id, url }}
            .content=${{ text }}
          ></oryx-content-link>
        </div>
      `
    )}`;
  }
}
