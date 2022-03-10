import './storefront.component';
import { StorefrontComponent } from './storefront.component';

vi.mock('./composition.component', () => {
  return;
});

describe('InputComponent', () => {
  beforeEach(async () => {
    document.body.innerHTML = '<storefront-component></storefront-component>';
    await window.happyDOM.whenAsyncComplete();
  });

  const getElement = (): StorefrontComponent => {
    return document.body.querySelector('storefront-component');
  };

  it('should render `composition-component` tag', () => {
    const element = getElement();
    const compositionComponent = element.shadowRoot?.querySelector(
      'composition-component'
    );

    expect(element).toBeInstanceOf(StorefrontComponent);
    expect(compositionComponent).toBeTruthy();
  });

  it('should render `composition-component` with `key` attributes passed from the `route` property', async () => {
    const mockRout = 'mockRout';
    const element = getElement();
    const compositionComponent = element.shadowRoot?.querySelector(
      'composition-component'
    );

    expect(compositionComponent.getAttribute('key')).toBe('/');

    element.setAttribute('route', mockRout);

    element.requestUpdate();
    await element.updateComplete;

    console.log(compositionComponent.getAttribute('key'));

    expect(compositionComponent.getAttribute('key')).toBe(mockRout);
  });
});
