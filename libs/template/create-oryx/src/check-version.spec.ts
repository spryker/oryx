import * as https from 'https';
import { Readable } from 'stream';
import { Mock } from 'vitest';
import { checkLatestVersion } from './check-version';

vi.mock('https', () => ({
  get: vi.fn(),
}));
vi.mock('../package.json', () => ({
  default: {
    name: 'your-package-name',
    version: '1.0.0',
  },
}));

describe('checkLatestVersion', () => {
  let consoleWarnMock: Mock;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    consoleWarnMock = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {}) as Mock;
  });

  afterEach(() => {
    consoleWarnMock.mockRestore();
    vi.restoreAllMocks();
  });

  function mockHttpResponse(body: any, error: any = null) {
    (https.get as Mock).mockImplementation((url, callback) => {
      callback(Readable.from([JSON.stringify(body)]));
      return {
        on: (event: any, handler: any) => {
          if (event === 'error' && error) {
            handler(error);
          }
        },
      };
    });
  }

  it('does not warn if current version is the latest', async () => {
    mockHttpResponse({ 'dist-tags': { latest: '1.0.0' } });

    await checkLatestVersion();

    expect(consoleWarnMock).not.toHaveBeenCalled();
  });

  it('warns if a newer version is available', async () => {
    mockHttpResponse({ 'dist-tags': { latest: '1.1.0' } });

    await checkLatestVersion();

    expect(consoleWarnMock).toHaveBeenCalledWith(
      `Warning: You are using your-package-name version 1.0.0, but version 1.1.0 is available. Consider updating to the latest version.`
    );
  });

  it('handles errors gracefully', async () => {
    mockHttpResponse({}, new Error('Network error'));

    expect(await checkLatestVersion()).toBeUndefined();
    expect(consoleWarnMock).not.toHaveBeenCalled();
  });
});
