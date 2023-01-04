import { inject } from '@spryker-oryx/di';
import { Mock } from 'vitest';
import { AppEnvironment, injectEnv } from './app-env';

vi.mock('@spryker-oryx/di');

describe('injectEnv() function', () => {
  const injectMock = inject as Mock;

  afterEach(() => void vi.resetAllMocks());

  it('should call `inject()` with `AppEnvironment` and empty object', () => {
    injectMock.mockReturnValue({});

    injectEnv('key');

    expect(injectMock).toHaveBeenCalledWith(AppEnvironment, {});
  });

  it('should return value by `key`', () => {
    injectMock.mockReturnValue({ key1: 'val1', key2: 'val2' });

    const res = injectEnv('key1');

    expect(res).toBe('val1');
  });

  it('should return `undefined` if by `key` does not exist', () => {
    injectMock.mockReturnValue({ key1: 'val1', key2: 'val2' });

    const res = injectEnv('key3');

    expect(res).toBe(undefined);
  });

  it('should return fallback value if by `key` does not exist', () => {
    injectMock.mockReturnValue({ key1: 'val1', key2: 'val2' });

    const res = injectEnv('key3', 'fallback');

    expect(res).toBe('fallback');
  });
});
