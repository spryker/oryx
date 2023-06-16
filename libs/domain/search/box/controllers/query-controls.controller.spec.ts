import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { QueryControlsController } from './query-controls.controller';

@customElement('fake-container')
class FakeContainer extends LitElement {
  controller = new QueryControlsController();

  @property({ type: String }) query = '';

  get input(): HTMLInputElement {
    return this.renderRoot.querySelector('input') as HTMLInputElement;
  }

  render(): TemplateResult {
    return html` <div>${this.controller.renderControls()}</div> `;
  }
}

describe('QueryControlsController', () => {
  let element: FakeContainer;

  const getControls = (): NodeList => {
    return element.renderRoot.querySelectorAll(`div button`);
  };

  const shouldMuteMousedown = (emitter: HTMLElement): void => {
    const event = new MouseEvent('mousedown', {
      bubbles: true,
    });
    const stopped = vi.spyOn(event, 'stopPropagation');
    const prevented = vi.spyOn(event, 'preventDefault');

    emitter.dispatchEvent(event);

    expect(stopped).toHaveBeenCalledOnce();
    expect(prevented).toHaveBeenCalledOnce();
  };

  describe('when clear button clicked', () => {
    const callback = vi.fn();
    let button: HTMLButtonElement;

    beforeAll(async () => {
      element = await fixture(html`
        <fake-container query="123" @oryx.clear=${callback}></fake-container>
      `);

      button = getControls()?.[0] as HTMLButtonElement;
      button?.dispatchEvent(new MouseEvent('click'));
    });

    it('should dispatch oryx.clear event', () => {
      expect(callback).toHaveBeenCalled();
    });

    it('should mute mousedown', () => {
      shouldMuteMousedown(button as HTMLElement);
    });
  });

  describe('when close button clicked', () => {
    const callback = vi.fn();
    let button: HTMLButtonElement;

    beforeAll(async () => {
      element = await fixture(html`
        <fake-container query="123" @oryx.close=${callback}></fake-container>
      `);

      button = getControls()?.[1] as HTMLButtonElement;
      button?.dispatchEvent(new MouseEvent('click'));
    });

    it('should dispatch oryx.close event', () => {
      expect(callback).toHaveBeenCalled();
    });

    it('should mute mousedown', () => {
      shouldMuteMousedown(button as HTMLElement);
    });
  });
});
