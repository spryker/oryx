/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mock } from 'vitest';
import { I18nMixin } from './i18n.mixin';

describe('I18nMixin', () => {
  let signalAwareMock: Mock;
  let i18nMock: Mock;

  beforeEach(() => {
    signalAwareMock = vi
      .fn()
      .mockReturnValue(vi.fn().mockImplementation((ctor) => ctor));
    i18nMock = vi.fn();

    I18nMixin.signalAware = signalAwareMock;
    I18nMixin.i18n = i18nMock;
  });

  it('should add `i18n` method that calls directive', () => {
    i18nMock.mockReturnValue('mock-result');
    class TestClass {}
    const MixedClass = I18nMixin(TestClass as any);

    const instance = new MixedClass();
    expect(instance.i18n).toEqual(expect.any(Function));

    const res = instance.i18n('token', { ctx: true });
    expect(i18nMock).toHaveBeenCalledWith('token', { ctx: true });
    expect(res).toBe('mock-result');
  });

  it('should apply `@signalAware()` decorator', () => {
    class TestClass {}
    const MixedClass = I18nMixin(TestClass as any);

    expect(signalAwareMock).toHaveBeenCalledWith();

    const decorator: Mock = (signalAwareMock as Mock).mock.results[0].value;
    expect(decorator).toHaveBeenCalledWith(MixedClass);
  });

  it('should return the same class if already mixed', () => {
    class TestClass {}
    const MixedClass = I18nMixin(TestClass as any);
    const MixedClass2 = I18nMixin(MixedClass);

    expect(MixedClass2).toBe(MixedClass);
  });
});
