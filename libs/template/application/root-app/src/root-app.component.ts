import { MetaService, TagDefinition } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { LitRouter } from '@spryker-oryx/router/lit';
import { hydratable, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { DirectionalityController } from './directionality.controller';
import { styles } from './root-app.styles';

const metas: TagDefinition[] = [
  {
    name: 'meta',
    attrs: {
      charset: 'UTF-8',
    },
  },
  {
    name: 'meta',
    attrs: {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0"',
    },
  },
  {
    name: 'link',
    attrs: {
      rel: 'icon',
      href: './favicon.png',
      sizes: '32x32',
    },
  },
  {
    name: 'link',
    attrs: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap',
    },
  },
  {
    name: 'title',
    attrs: {
      text: 'Composable Storefront',
    },
  },
];

@hydratable()
export class RootAppComponent extends LitElement {
  static styles = styles;

  constructor() {
    super();
    // TODO: temporary will be done on orchestration side before components loading
    const meta = resolve(MetaService);
    meta.addTags(metas);
    meta.updateTag({ name: 'html', attrs: { lang: 'en' } });
  }

  @subscribe()
  protected dirSetup = new DirectionalityController(this).install();

  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    return html`
      <experience-composition uid="header"></experience-composition>
      ${this.router.outlet()}
      <experience-composition uid="footer"></experience-composition>
    `;
  }
}
