import latestVersion from 'latest-version';
import { Mock } from 'vitest';
import { checkLatestVersion } from './check-version';

vi.mock('latest-version', () => ({
  default: vi.fn(),
}));
vi.mock('../package.json', () => ({
  default: {
    name: 'your-package-name',
    version: '1.0.0',
  },
}));

describe('checkLatestVersion', () => {
  let consoleWarnMock: any;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnMock.mockRestore();
  });

  it('does not warn if current version is the latest', async () => {
    (latestVersion as Mock).mockResolvedValue('1.0.0');

    await checkLatestVersion();

    expect(consoleWarnMock).not.toHaveBeenCalled();
  });

  it('warns if a newer version is available', async () => {
    (latestVersion as Mock).mockResolvedValue('1.1.0');

    await checkLatestVersion();

    expect(consoleWarnMock).toHaveBeenCalledWith(
      `Warning: You are using your-package-name version 1.0.0, but version 1.1.0 is available. Consider updating to the latest version.`
    );
  });

  it('handles errors gracefully', async () => {
    (latestVersion as Mock).mockRejectedValue(new Error('Network error'));

    await expect(checkLatestVersion()).resolves.toBeUndefined();
    expect(consoleWarnMock).not.toHaveBeenCalled();
  });
});
