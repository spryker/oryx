import { describe, expect, it } from 'vitest';
import { ssrStyleShim } from './style.shim';

describe('ssrStyleShim', () => {
  let element: HTMLElement;

  beforeEach(() => {
    class MockElement {
      map: Record<string, any> = {};
      hasAttribute = vi.fn((a) => this.map[a] === undefined);
      setAttribute = vi.fn((a, v) => (this.map[a] = v));
      getAttribute = vi.fn((a) => this.map[a]);
      removeAttribute = vi.fn((a) => delete this.map[a]);
    }
    ssrStyleShim(MockElement as any);
    element = new MockElement() as unknown as HTMLElement;
  });

  it('should correctly toggle an attribute', () => {
    element.toggleAttribute('test-attribute', true);
    expect(element.setAttribute).toHaveBeenCalledWith('test-attribute', '');

    element.toggleAttribute('test-attribute', false);
    expect(element.removeAttribute).toHaveBeenCalledWith('test-attribute');
  });

  it('should handle style properties correctly', () => {
    element.style.setProperty('color', 'red');
    expect(element.style.color).toBe('red');
  });
});
