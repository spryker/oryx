import { isClient } from '@spryker-oryx/typescript-utils';
import { Directive, directive } from 'lit/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html } from 'lit/static-html.js';

const components: { [key: string]: boolean } = {};

class ScriptDirective extends Directive {
  render(contents: string, tag: string): unknown {
    if (components[tag] || isClient()) {
      return html``;
    }
    components[tag] = true;
    return html`${unsafeHTML(`<script>window.scriptFns = window.scriptFns ?? {};
      window.scriptFns['${tag}'] = ${contents}</script>`)}`;
  }
}

export const script = directive(ScriptDirective);
