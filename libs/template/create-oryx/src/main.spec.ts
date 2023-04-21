import { vi } from 'vitest';

const mockCliApp = {
  withOptions: vi.fn().mockReturnThis(),
  create: vi.fn(),
};

vi.mock('@spryker-oryx/cli', () => ({ cliApp: mockCliApp }));

describe('main.ts', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create cli app with `create` + arguments skipping first 2', async () => {
    vi.stubGlobal('process', {
      argv: ['skip1', 'skip2', '--arg1', '--arg2'],
    });

    await import('./main');

    expect(mockCliApp.withOptions).toHaveBeenCalledWith({
      cli: { args: ['create', '--arg1', '--arg2'] },
    });
    expect(mockCliApp.create).toHaveBeenCalled();
  });
});
