import { fixture } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { hook, HOOKS_KEY } from './hook.decorator';

@customElement('mock-element')
class FakeComponent extends LitElement {
  @hook('keyA')
  static propA = 'propA';

  @hook('keyB')
  static propB = 'propA';

  @hook('keyC')
  static propC = 'propA';

  render(): TemplateResult {
    return html`render`;
  }
}

describe('hook', () => {
  beforeEach(async () => {
    await fixture(html`<mock-element></mock-element>`);
  });

  it(`should create static ${HOOKS_KEY} property with key and property name`, async () => {
    expect(
      (
        FakeComponent as {
          [HOOKS_KEY]?: Record<string, string>;
        }
      )[HOOKS_KEY]
    ).toEqual({
      keyA: 'propA',
      keyB: 'propB',
      keyC: 'propC',
    });
  });
});
