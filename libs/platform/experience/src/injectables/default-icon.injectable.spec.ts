import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DefaultIconInjectable } from './default-icon.injectable';

@customElement('mock-component')
class MockComponent extends LitElement {
  @property()
  icon?: string;

  protected injectable = new DefaultIconInjectable();

  render(): TemplateResult {
    if (!this.icon) {
      return html``;
    }

    return this.injectable.render(this.icon) ?? html``;
  }
}

export const mockTheme = {
  getIcon: vi.fn(),
};

export const mockApp = {
  findPlugin: vi.fn().mockReturnValue(mockTheme),
};

describe('DefaultIconInjectable', () => {
  let element: MockComponent;

  beforeEach(async () => {
    vi.clearAllMocks();
    createInjector({
      providers: [
        {
          provide: AppRef,
          useValue: mockApp,
        },
      ],
    });
    element = await fixture(html`<mock-component></mock-component>`);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should return svg with icon content', async () => {
    mockTheme.getIcon.mockReturnValue('<div class="icon-content"></div>');
    element.icon = 'icon';
    await nextFrame();
    expect(mockTheme.getIcon).toHaveBeenCalledWith('icon');
    expect(element).toContainElement('svg');
    expect(element).toContainElement('.icon-content');
  });

  it('should return nothing if icons is not exist', async () => {
    mockTheme.getIcon.mockReturnValue(undefined);
    element.icon = 'icon';
    await nextFrame();
    expect(mockTheme.getIcon).toHaveBeenCalledWith('icon');
    expect(element).not.toContainElement('svg');
  });
});
