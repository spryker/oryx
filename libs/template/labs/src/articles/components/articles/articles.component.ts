import { ContentService } from '@spryker-oryx/content';
import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  computed,
  hydratable,
  signal,
  signalAware,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { of } from 'rxjs';
import { ArticleContext } from '../../article-context';

@signalAware()
@hydratable()
export class ArticlesComponent extends LitElement {
  protected contentService = resolve(ContentService);
  protected contextController = new ContextController(this);

  protected $articleType = signal(
    this.contextController.get<string>(ArticleContext.Type)
  );

  protected $data = computed(() => {
    const type = this.$articleType();
    console.log(type);
    return type ? this.contentService.getAll({ type }) : of(null);
  });

  protected override render(): TemplateResult | void {
    const data = this.$data();
    console.log(data);
    if (!data?.length) {
      return;
    }

    return html`${data.map(
      ({ type, id, url, heading: text }) => html`
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
