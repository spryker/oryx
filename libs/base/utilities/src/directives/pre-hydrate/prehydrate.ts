import { isServer, LitElement } from 'lit';
import { Directive, directive } from 'lit/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html } from 'lit/static-html.js';
import { dryLogic } from './dry-logic';

const components: { [key: string]: boolean } = {};

/**
 * Directive is used to inline javascript snippet with Server Side Rendered component.
 * Because of obvious overhead, it's intended to efficiently fix component rendering in order
 * to provide correct UI for not hydrated component but also to minimize UI changes and LCP metric.
 *
 * - dryFunction: code intended to fix SSR markup. At runtime, it will receive element instance and will
 *   be invoked for every element
 * - tag: element's tag name (currently required, to make the logic work)
 */
class PreHydrateDirective extends Directive {
  render(
    dryFunction: (host: LitElement) => void | Promise<void>,
    tag: string
  ): unknown {
    if (!isServer) {
      return html``;
    }

    if (components[tag]) {
      return html`${unsafeHTML(
        `<script>try{__dryFn('${tag}')}catch{}</script>`
      )}`;
    }
    const first = Object.keys(components).length == 0;
    components[tag] = true;
    return html`${unsafeHTML(
      `<script>${
        first ? `const __dryFn=(${dryLogic.toString()})();` : ''
      }__dryFn('${tag}', ${dryFunction.toString()});</script>`
    )}`;
  }
}

export const preHydrate = directive(PreHydrateDirective);
