import { vi } from 'vitest';

const mockCliBuilder = {
  create: vi.fn(),
};
const mockCliApp = vi.fn().mockReturnValue(mockCliBuilder);

vi.mock('@spryker-oryx/cli', () => ({ cliApp: mockCliApp }));

describe('cli.ts', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create cli app with arguments skipping first 2', async () => {
    vi.stubGlobal('process', {
      argv: ['skip1', 'skip2', 'cmd', '--arg1', '--arg2'],
    });

    await import('./cli');

    expect(mockCliApp).toHaveBeenCalledWith({
      cli: { args: ['cmd', '--arg1', '--arg2'] },
    });
    expect(mockCliBuilder.create).toHaveBeenCalled();
  });
});
