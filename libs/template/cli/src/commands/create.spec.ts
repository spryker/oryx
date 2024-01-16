import * as prompts from '@clack/prompts';
import fs, { PathLike } from 'fs';
import path from 'path';
import { CreateCliCommand } from './create';

vi.mock('@clack/prompts');
vi.mock('fs');
vi.mock('path');

describe('CreateCliCommand', () => {
  class MockAppTemplateBuilderService {
    setPreset = vi.fn();
    setFeatures = vi.fn();
    update = vi.fn();
    updatePreset = vi.fn();
    updateFeatures = vi.fn();
  }

  class MockAppTemplateLoaderService {
    copyTemplate = vi.fn();
    downloadTemplate = vi.fn();
  }

  class MockApplicationCliService {
    getApplicationConfig = vi.fn();
    getPresets = vi.fn();
    getApplicationTypes = vi.fn();
  }

  class MockCliArgsService {
    get = vi.fn();
  }

  class MockNodeUtilService {
    executeCommand = vi.fn();
  }

  function setup() {
    const cliArgsService = new MockCliArgsService();
    const nodeUtilService = new MockNodeUtilService();
    const appTemplateBuilderService = new MockAppTemplateBuilderService();
    const appTemplateLoaderService = new MockAppTemplateLoaderService();
    const applicationCliService = new MockApplicationCliService();
    const spinnerMock = { start: vi.fn(), stop: vi.fn() };

    const command = new CreateCliCommand(
      cliArgsService as any,
      appTemplateLoaderService as any,
      applicationCliService as any,
      appTemplateBuilderService as any,
      nodeUtilService as any
    );
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
        { name: 'preset', short: 'p', type: 'string' },
        { name: 'theme', short: 't', type: 'string' },
        { name: 'features', short: 'f', type: 'string' },
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
          [2m-n, --name[22m       The name of the app and the directory to create.
          [2m-t, --type[22m       An application type to use.
          [2m-p, --preset[22m     A preset to use.
          [2m-f, --features[22m   A list of features to use.
        "
      `);
    });
  });

  describe('execute()', () => {
    it('should call createApp() with the correct options', async () => {
      const { command, cliArgsService } = setup();
      const createAppSpy = vi.spyOn(command, 'createApp').mockResolvedValue();

      cliArgsService.get.mockImplementation((name: string) => {
        if (name === 'name') {
          return 'my-app';
        }
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
          if (path === '/mock-cwd/mock-name') {
            return false;
          }
          return true;
        });

        await expect(command.createApp({})).resolves.toBeUndefined();

        expect(textSpy).toHaveBeenCalledWith({
          message: expect.stringContaining('What is the name of your application?'),
          defaultValue: 'oryx-app',
          placeholder: 'oryx-app',
        });
        expect(isCancelSpy).toHaveBeenCalledWith('mock-name');
      });

  //   it('should reject if prompt was cancelled', async () => {
  //     const { command } = setup();
  //     const textSpy = vi
  //       .spyOn(prompts, 'text')
  //       .mockResolvedValue('mock-name');
  //     const isCancelSpy = vi.spyOn(prompts, 'isCancel').mockReturnValue(true);
  //
  //     await expect(command.createApp({})).rejects.toMatchInlineSnapshot(
  //       '"Operation cancelled."'
  //     );
  //
  //     expect(textSpy).toHaveBeenCalled();
  //     expect(isCancelSpy).toHaveBeenCalledWith('mock-name');
  //   });
    });
  //
  // describe('with an app name', () => {
  //   it('should not prompt for the app name', async () => {
  //     const { command } = setup();
  //     const textSpy = vi.spyOn(prompts, 'text');
  //     const isCancelSpy = vi.spyOn(prompts, 'isCancel');
  //
  //     await expect(
  //       command.createApp({ name: 'mock-name' })
  //     ).resolves.toBeUndefined();
  //
  //     expect(textSpy).not.toHaveBeenCalled();
  //     expect(isCancelSpy).not.toHaveBeenCalled();
  //   });
  //
  //   it('should log app name', async () => {
  //     const { command } = setup();
  //     const logSpy = vi.spyOn(prompts.log, 'info');
  //
  //     await expect(
  //       command.createApp({ name: 'mock-name' })
  //     ).resolves.toBeUndefined();
  //
  //     expect(logSpy).toHaveBeenCalledWith(
  //       expect.stringContaining('mock-name')
  //     );
  //   });
  // });
  //
  // it('should reject if directory with app name already exists', async () => {
  //   const { command } = setup();
  //   vi.spyOn(fs, 'existsSync').mockImplementation((path: PathLike) => {
  //     if (path === '/mock-cwd/existing-app') {
  //       return true;
  //     }
  //     return false;
  //   });
  //
  //   await expect(command.createApp({ name: 'existing-app' })).rejects
  //     .toMatchInlineSnapshot(`
  //     [Error: Directory 'existing-app' already exists!
  //     Please make sure to not use an existing directory name.]
  //   `);
  // });

  // it('should download and extract latest template', async () => {
  //   vi.spyOn(fs, 'existsSync').mockImplementation((path: PathLike) => {
  //     if (
  //       path === '/mock-cwd/mock-name' ||
  //       path === '/mock-root/../../template/latest' ||
  //       path === '/mock-root/../../template-latest.zip'
  //     ) {
  //       return false;
  //     }
  //     return true;
  //   });
  //
  //   const { command, nodeUtilService, spinnerMock } = setup();
  //
  //   await expect(
  //     command.createApp({ name: 'mock-name' })
  //   ).resolves.toBeUndefined();
  //
  //   expect(spinnerMock.start).toHaveBeenCalledWith(
  //     expect.stringContaining('Installing application...')
  //   );
  //   expect(nodeUtilService.downloadFile).toHaveBeenCalledWith(
  //     'https://github.com/spryker/oryx-starter/archive/refs/heads/master.zip',
  //     '/mock-root/../../template-latest.zip'
  //   );
  //   expect(spinnerMock.stop).toHaveBeenCalledWith(
  //     expect.stringContaining('Application installed')
  //   );
  //
  //   expect(spinnerMock.start).toHaveBeenCalledWith(
  //     expect.stringContaining('Installing application...')
  //   );
  //   expect(nodeUtilService.extractZip).toHaveBeenCalledWith(
  //     '/mock-root/../../template-latest.zip',
  //     '/mock-root/../../template/latest'
  //   );
  //   expect(spinnerMock.stop).toHaveBeenCalledWith(
  //     expect.stringContaining('Application installed')
  //   );
  // });
  //
  // it('should copy template to app directory', async () => {
  //   const { command, nodeUtilService, spinnerMock } = setup();
  //
  //   await expect(
  //     command.createApp({ name: 'mock-name' })
  //   ).resolves.toBeUndefined();
  //
  //   expect(spinnerMock.start).toHaveBeenCalledWith(
  //     expect.stringContaining('Installing dependencies...')
  //   );
  //   expect(nodeUtilService.copyFolder).toHaveBeenCalledWith(
  //     '/mock-root/../../template/latest/oryx-starter-master',
  //     '/mock-cwd/mock-name'
  //   );
  //   expect(spinnerMock.stop).toHaveBeenLastCalledWith(
  //     expect.stringContaining('Dependencies installed')
  //   );
  // });
  });
});
