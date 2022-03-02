import '@lit-labs/ssr/lib/render-with-global-dom-shim.js';
import { LitElementRenderer } from '@lit-labs/ssr/lib/lit-element-renderer.js';
import { RenderInfo } from '@lit-labs/ssr/lib/render-lit-html.js';
import { digestForTemplateResult } from 'lit/experimental-hydrate.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { Readable } from 'stream';

export { StorefrontComponent } from './storefront.component';

// Simplified method adapted from Astro for rendering lit components in a generic way.
const generateHtml = function* (element, props) {
  let instance = new LitElementRenderer(element);
  let propsArray = Object.keys(props);
  for (let i = 0; i < propsArray.length; i++) {
    let key = propsArray[i];
    instance.setProperty(key, props[key]);
  }

  // Needed for the lit-part tag so that hydration finds it.
  // May not actually match the version used by lit-labs/ssr supplied render functions.
  // We don't pass unsafeStatic templates to any render functions, so this is okay.
  let template = html`<${unsafeStatic(element)} ${unsafeStatic(
    `${propsArray
      .map((prop) => {
        return `${prop}=${
          typeof props[prop] === 'string' ? `"${props[prop]}"` : props[prop]
        }`;
      })
      .join(' ')}`
  )}></${unsafeStatic(element)}>`;

  instance.connectedCallback();

  yield `<!--lit-part ${digestForTemplateResult(template)}-->`;
  yield `<${element}`;
  yield* instance.renderAttributes();
  yield `>`;
  const shadowContents = instance.renderShadow({} as RenderInfo);
  if (shadowContents !== undefined) {
    yield '<template shadowroot="open">';
    yield* shadowContents;
    yield '</template>';
  }
  // not sure we need this...
  //yield children || ''; // don’t print “undefined” as string
  yield `</${element}>`;
  yield `<!--/lit-part-->`;
};

export const renderComponent = async (element) => {
  return await generateHtml(element.tag, element.props);
};

export const render = async (element) => {
  let ssrResult = await renderComponent(element);
  let stream = '';
  let readable = Readable.from(ssrResult);

  readable.on('data', function (data) {
    stream += data;
  });

  await new Promise<void>((resolve) =>
    readable.on('end', function () {
      resolve();
    })
  );
  return stream;
};
