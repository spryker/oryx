import * as prompts from '@clack/prompts';
import fs, { PathLike } from 'fs';
import path from 'path';
import { CreateCliCommand } from './create';

vi.mock('@clack/prompts');
vi.mock('fs');
vi.mock('path');

describe('CreateCliCommand', () => {
  class MockCliArgsService {
    get = vi.fn();
  }

  class MockNodeUtilService {
    downloadFile = vi.fn();
    extractZip = vi.fn();
    copyFolder = vi.fn();
    executeCommand = vi.fn();
  }

  function setup() {
    const cliArgsService = new MockCliArgsService();
    const nodeUtilService = new MockNodeUtilService();
    const command = new CreateCliCommand(
      cliArgsService as any,
      nodeUtilService as any,
      '/mock-root'
    );

    const spinnerMock = { start: vi.fn(), stop: vi.fn() };
    const spinnerSpy = vi
      .spyOn(prompts, 'spinner')
      .mockReturnValue(spinnerMock);
    const processCwdSpy = vi.spyOn(process, 'cwd').mockReturnValue('/mock-cwd');
    const resolveSpy = vi
      .spyOn(path, 'resolve')
      .mockImplementation((...args: string[]) => {
        return args.join('/');
      });

    return {
      command,
      cliArgsService,
      nodeUtilService,
      spinnerSpy,
      spinnerMock,
      processCwdSpy,
      resolveSpy,
    };
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getName()', () => {
    it('should return the name of the command', () => {
      const { command } = setup();

      expect(command.getName()).toBe('create');
    });
  });

  describe('getAliases()', () => {
    it('should return the aliases of the command', () => {
      const { command } = setup();

      expect(command.getAliases()).toEqual(['c']);
    });
  });

  describe('getOptions()', () => {
    it('should return the options of the command', () => {
      const { command } = setup();

      expect(command.getOptions()).toEqual([
        { name: 'name', short: 'n', type: 'string' },
      ]);
    });
  });

  describe('getHelp()', () => {
    it('should return the help of the command', () => {
      const { command } = setup();

      expect(command.getHelp()).toMatchInlineSnapshot(`
        "
        Create a new Oryx app.
        Usage: [1moryx create[22m [2m[options][22m

        Aliases: [1mc[22m

        Options:
          [2m-n, --name[22m    The name of the app and the directory to create.
        "
      `);
    });
  });

  describe('execute()', () => {
    it('should call createApp() with the correct options', async () => {
      const { command, cliArgsService } = setup();
      const createAppSpy = vi.spyOn(command, 'createApp').mockResolvedValue();

      cliArgsService.get.mockImplementation((name: string) => {
        if (name === 'name') return 'my-app';

        return;
      });

      await expect(command.execute()).resolves.toBeUndefined();

      expect(createAppSpy).toHaveBeenCalledWith({
        name: 'my-app',
      });
    });

    it('should call createApp() with the default options', async () => {
      const { command } = setup();
      const createAppSpy = vi.spyOn(command, 'createApp').mockResolvedValue();

      await expect(command.execute()).resolves.toBeUndefined();

      expect(createAppSpy).toHaveBeenCalledWith({
        name: undefined,
      });
    });
  });

  describe('createApp()', () => {
    describe('without an app name', () => {
      it('should prompt for the app name', async () => {
        const { command } = setup();
        const textSpy = vi
          .spyOn(prompts, 'text')
          .mockResolvedValue('mock-name');
        const isCancelSpy = vi
          .spyOn(prompts, 'isCancel')
          .mockReturnValue(false);
        vi.spyOn(fs, 'existsSync').mockImplementation((path: PathLike) => {
          if (path === '/mock-cwd/mock-name') return false;

          return true;
        });

        await expect(command.createApp({})).resolves.toBeUndefined();

        expect(textSpy).toHaveBeenCalledWith({
          message: expect.stringContaining('What is the name of your app?'),
          defaultValue: 'oryx-app',
          placeholder: 'oryx-app',
        });
        expect(isCancelSpy).toHaveBeenCalledWith('mock-name');
      });

      it('should reject if prompt was cancelled', async () => {
        const { command } = setup();
        const textSpy = vi
          .spyOn(prompts, 'text')
          .mockResolvedValue('mock-name');
        const isCancelSpy = vi.spyOn(prompts, 'isCancel').mockReturnValue(true);

        await expect(command.createApp({})).rejects.toMatchInlineSnapshot(
          '"Operation cancelled."'
        );

        expect(textSpy).toHaveBeenCalled();
        expect(isCancelSpy).toHaveBeenCalledWith('mock-name');
      });
    });

    describe('with an app name', () => {
      it('should not prompt for the app name', async () => {
        const { command } = setup();
        const textSpy = vi.spyOn(prompts, 'text');
        const isCancelSpy = vi.spyOn(prompts, 'isCancel');

        await expect(
          command.createApp({ name: 'mock-name' })
        ).resolves.toBeUndefined();

        expect(textSpy).not.toHaveBeenCalled();
        expect(isCancelSpy).not.toHaveBeenCalled();
      });

      it('should log app name', async () => {
        const { command } = setup();
        const logSpy = vi.spyOn(prompts.log, 'info');

        await expect(
          command.createApp({ name: 'mock-name' })
        ).resolves.toBeUndefined();

        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining('mock-name')
        );
      });
    });

    it('should reject if directory with app name already exists', async () => {
      const { command } = setup();
      vi.spyOn(fs, 'existsSync').mockImplementation((path: PathLike) => {
        if (path === '/mock-cwd/existing-app') return true;

        return false;
      });

      await expect(command.createApp({ name: 'existing-app' })).rejects
        .toMatchInlineSnapshot(`
        [Error: Directory 'existing-app' already exists!
        Please make sure to not use an existing directory name.]
      `);
    });

    it('should download and extract latest template', async () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((path: PathLike) => {
        if (
          path === '/mock-cwd/mock-name' ||
          path === '/mock-root/../../repo/latest' ||
          path === '/mock-root/../../template-latest.zip'
        )
          return false;

        return true;
      });

      const { command, nodeUtilService, spinnerMock } = setup();

      await expect(
        command.createApp({ name: 'mock-name' })
      ).resolves.toBeUndefined();

      expect(spinnerMock.start).toHaveBeenCalledWith(
        expect.stringContaining('Installing application...')
      );
      expect(nodeUtilService.downloadFile).toHaveBeenCalledWith(
        'https://github.com/spryker/composable-frontend/archive/refs/heads/master.zip',
        '/mock-root/../../template-latest.zip'
      );
      expect(spinnerMock.stop).toHaveBeenCalledWith(
        expect.stringContaining('Application installed')
      );

      expect(spinnerMock.start).toHaveBeenCalledWith(
        expect.stringContaining('Installing application...')
      );
      expect(nodeUtilService.extractZip).toHaveBeenCalledWith(
        '/mock-root/../../template-latest.zip',
        '/mock-root/../../repo/latest'
      );
      expect(spinnerMock.stop).toHaveBeenCalledWith(
        expect.stringContaining('Application installed')
      );
    });

    it('should skip downloading latest template if already downloaded', async () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((path: PathLike) => {
        if (
          path === '/mock-cwd/mock-name' ||
          path === '/mock-root/../../repo/latest'
        )
          return false;

        return true;
      });

      const { command, nodeUtilService, spinnerMock } = setup();

      await expect(
        command.createApp({ name: 'mock-name' })
      ).resolves.toBeUndefined();

      expect(spinnerMock.start).not.toHaveBeenCalledWith(
        expect.stringContaining('Downloading latest template')
      );
      expect(nodeUtilService.downloadFile).not.toHaveBeenCalled();
      expect(spinnerMock.stop).not.toHaveBeenCalledWith(
        expect.stringContaining('Template downloaded')
      );

      expect(spinnerMock.start).toHaveBeenCalledWith(
        expect.stringContaining('Installing application...')
      );
      expect(nodeUtilService.extractZip).toHaveBeenCalled();
      expect(spinnerMock.stop).toHaveBeenCalledWith(
        expect.stringContaining('Application installed')
      );
    });

    it('should skip downloading and extracting latest template if already extracted', async () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((path: PathLike) => {
        if (path === '/mock-cwd/mock-name') return false;

        return true;
      });

      const { command, nodeUtilService, spinnerMock } = setup();

      await expect(
        command.createApp({ name: 'mock-name' })
      ).resolves.toBeUndefined();

      expect(spinnerMock.start).not.toHaveBeenCalledWith(
        expect.stringContaining('Downloading latest template')
      );
      expect(nodeUtilService.downloadFile).not.toHaveBeenCalled();
      expect(spinnerMock.stop).not.toHaveBeenCalledWith(
        expect.stringContaining('Template downloaded')
      );

      expect(spinnerMock.start).not.toHaveBeenCalledWith(
        expect.stringContaining('"Installing application...')
      );
      expect(nodeUtilService.extractZip).not.toHaveBeenCalled();
      expect(spinnerMock.stop).not.toHaveBeenCalledWith(
        expect.stringContaining('Template extracted')
      );
    });

    it('should copy template to app directory', async () => {
      const { command, nodeUtilService, spinnerMock } = setup();

      await expect(
        command.createApp({ name: 'mock-name' })
      ).resolves.toBeUndefined();

      expect(spinnerMock.start).toHaveBeenCalledWith(
        expect.stringContaining('Installing dependencies...')
      );
      expect(nodeUtilService.copyFolder).toHaveBeenCalledWith(
        '/mock-root/../../repo/latest/composable-frontend-master',
        '/mock-cwd/mock-name'
      );
      expect(spinnerMock.stop).toHaveBeenLastCalledWith(
        expect.stringContaining('Dependencies installed')
      );
    });
  });
});
