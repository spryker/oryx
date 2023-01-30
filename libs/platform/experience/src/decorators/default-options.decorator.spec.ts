import { LitElement } from 'lit';
import { defaultOptions, optionsKey } from './default-options.decorator';

@defaultOptions({
  a: 'a',
  b: 'b',
})
class MockAComponent extends LitElement {}

@defaultOptions({
  a: 'b',
  c: 'c',
})
class MockBComponent extends MockAComponent {}

describe('defaultOptions decorator', () => {
  it('should assign options as static property', () => {
    expect(
      (MockAComponent as unknown as { [optionsKey]: unknown })[optionsKey]
    ).toEqual({
      a: 'a',
      b: 'b',
    });
  });

  it('should merge options for extended component with default options', () => {
    expect(
      (MockBComponent as unknown as { [optionsKey]: unknown })[optionsKey]
    ).toEqual({
      a: 'b',
      b: 'b',
      c: 'c',
    });
  });
});
