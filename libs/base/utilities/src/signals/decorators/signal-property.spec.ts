import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { effect } from '../core';
import { signalProperty } from './signal-property';

@customElement('test-element')
class TestElement extends LitElement {
  @signalProperty()
  value?: string;
}

describe('signalProperty', () => {
  let testElement: TestElement;

  beforeEach(() => {
    testElement = new TestElement();
  });

  it('should have a getter and setter for the property', () => {
    const testValue = 'Hello, world!';
    testElement.value = testValue;
    expect(testElement.value).toBe(testValue);
  });

  it('should work as signal', async () => {
    const results: any[] = [];

    const ef = effect(() => {
      results.push(testElement.value);
    });

    testElement.value = '1';
    testElement.value = '2';
    testElement.value = '3';

    ef.stop();

    await 0;

    expect(results).toEqual([undefined, '1', '2', '3']);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
