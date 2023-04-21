import * as prompts from '@clack/prompts';
import fs, { PathLike } from 'fs';
import path from 'path';
import { CreateCliCommand, OryxPreset } from './create';

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
        { name: 'preset', short: 'p', type: 'string' },
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
          [2m-p, --preset[22m  The preset to use. Possible values: b2c, fulfillment
        "
      `);
    });
  });

  describe('execute()', () => {
    it('should reject if the preset is unknown', async () => {
      const { command, cliArgsService } = setup();

      cliArgsService.get.mockImplementation((name: string) => {
        if (name === 'preset') {
          return 'unknown';
        }
        return;
      });

      await expect(command.execute()).rejects.toMatchInlineSnapshot(`
        [Error: Unknown preset 'unknown'!
        Possible values: b2c, fulfillment]
      `);
    });

    it('should call createApp() with the correct options', async () => {
      const { command, cliArgsService } = setup();
      const createAppSpy = vi.spyOn(command, 'createApp').mockResolvedValue();

      cliArgsService.get.mockImplementation((name: string) => {
        if (name === 'name') {
          return 'my-app';
        }
        if (name === 'preset') {
          return OryxPreset.B2C;
        }
        return;
      });

      await expect(command.execute()).resolves.toBeUndefined();

      expect(createAppSpy).toHaveBeenCalledWith({
        name: 'my-app',
        preset: OryxPreset.B2C,
      });
    });

    it('should call createApp() with the default options', async () => {
      const { command } = setup();
      const createAppSpy = vi.spyOn(command, 'createApp').mockResolvedValue();

      await expect(command.execute()).resolves.toBeUndefined();

      expect(createAppSpy).toHaveBeenCalledWith({
        name: undefined,
        preset: undefined,
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

        await expect(
          command.createApp({ preset: OryxPreset.B2C })
        ).resolves.toBeUndefined();

        expect(textSpy).toHaveBeenCalledWith({
          message: expect.stringContaining('What is the name of your app?'),
          validate: expect.any(Function),
        });
        expect(isCancelSpy).toHaveBeenCalledWith('mock-name');
      });

      it('should validate the app name', async () => {
        const { command } = setup();
        const textSpy = vi
          .spyOn(prompts, 'text')
          .mockResolvedValue('mock-name');

        await expect(
          command.createApp({ preset: OryxPreset.B2C })
        ).resolves.toBeUndefined();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const validateCb = textSpy.mock.calls[0][0].validate!;

        expect(validateCb('')).toMatchInlineSnapshot('"Please enter a name"');
        expect(validateCb(' ')).toMatchInlineSnapshot('"Please enter a name"');
        expect(validateCb('my-app')).toBeUndefined();
        expect(validateCb('my app')).toBeUndefined();
      });

      it('should reject if prompt was cancelled', async () => {
        const { command } = setup();
        const textSpy = vi
          .spyOn(prompts, 'text')
          .mockResolvedValue('mock-name');
        const isCancelSpy = vi.spyOn(prompts, 'isCancel').mockReturnValue(true);

        await expect(
          command.createApp({ preset: OryxPreset.B2C })
        ).rejects.toMatchInlineSnapshot('"Operation cancelled."');

        expect(textSpy).toHaveBeenCalled();
        expect(isCancelSpy).toHaveBeenCalledWith('mock-name');
      });
    });

    describe('without a preset', () => {
      it('should prompt for the preset', async () => {
        const { command } = setup();
        const selectSpy = vi
          .spyOn(prompts, 'select')
          .mockResolvedValue('mock-preset');
        const isCancelSpy = vi
          .spyOn(prompts, 'isCancel')
          .mockReturnValue(false);

        await expect(
          command.createApp({ name: 'mock-name' })
        ).resolves.toBeUndefined();

        expect(selectSpy).toHaveBeenCalledWith({
          message: expect.stringContaining(
            'Which preset would you like to use?'
          ),
          initialValue: OryxPreset.B2C,
          options: [
            {
              label: 'B2C',
              value: OryxPreset.B2C,
              hint: 'For standard B2C based storefronts',
            },
            {
              label: 'Fulfillment',
              value: OryxPreset.Fulfillment,
              hint: 'For fulfillment related applications',
            },
          ],
        });
        expect(isCancelSpy).toHaveBeenCalledWith('mock-preset');
      });

      it('should reject if prompt was cancelled', async () => {
        const { command } = setup();
        const selectSpy = vi
          .spyOn(prompts, 'select')
          .mockResolvedValue('mock-preset');
        const isCancelSpy = vi.spyOn(prompts, 'isCancel').mockReturnValue(true);

        await expect(
          command.createApp({ name: 'mock-name' })
        ).rejects.toMatchInlineSnapshot('"Operation cancelled."');

        expect(selectSpy).toHaveBeenCalled();
        expect(isCancelSpy).toHaveBeenCalledWith('mock-preset');
      });
    });

    describe('with an app name', () => {
      it('should not prompt for the app name', async () => {
        const { command } = setup();
        const textSpy = vi.spyOn(prompts, 'text');
        const isCancelSpy = vi.spyOn(prompts, 'isCancel');

        await expect(
          command.createApp({ name: 'mock-name', preset: OryxPreset.B2C })
        ).resolves.toBeUndefined();

        expect(textSpy).not.toHaveBeenCalled();
        expect(isCancelSpy).not.toHaveBeenCalled();
      });

      it('should log app name', async () => {
        const { command } = setup();
        const logSpy = vi.spyOn(prompts.log, 'info');

        await expect(
          command.createApp({ name: 'mock-name', preset: OryxPreset.B2C })
        ).resolves.toBeUndefined();

        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining('mock-name')
        );
      });
    });

    describe('with a preset', () => {
      it('should not prompt for the preset', async () => {
        const { command } = setup();
        const selectSpy = vi.spyOn(prompts, 'select');
        const isCancelSpy = vi.spyOn(prompts, 'isCancel');

        await expect(
          command.createApp({ name: 'mock-name', preset: OryxPreset.B2C })
        ).resolves.toBeUndefined();

        expect(selectSpy).not.toHaveBeenCalled();
        expect(isCancelSpy).not.toHaveBeenCalled();
      });

      it('should log preset', async () => {
        const { command } = setup();
        const logSpy = vi.spyOn(prompts.log, 'info');

        await expect(
          command.createApp({ name: 'mock-name', preset: OryxPreset.B2C })
        ).resolves.toBeUndefined();

        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining(OryxPreset.B2C)
        );
      });
    });

    it('should reject if directory with app name already exists', async () => {
      const { command } = setup();
      vi.spyOn(fs, 'existsSync').mockImplementation((path: PathLike) => {
        if (path === '/mock-cwd/existing-app') {
          return true;
        }
        return false;
      });

      await expect(
        command.createApp({ name: 'existing-app', preset: OryxPreset.B2C })
      ).rejects.toMatchInlineSnapshot(`
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
        ) {
          return false;
        }
        return true;
      });

      const { command, nodeUtilService, spinnerMock } = setup();

      await expect(
        command.createApp({ name: 'mock-name', preset: OryxPreset.B2C })
      ).resolves.toBeUndefined();

      expect(spinnerMock.start).toHaveBeenCalledWith(
        expect.stringContaining('Downloading latest template')
      );
      expect(nodeUtilService.downloadFile).toHaveBeenCalledWith(
        'https://github.com/spryker/oryx/archive/refs/heads/development.zip',
        '/mock-root/../../template-latest.zip'
      );
      expect(spinnerMock.stop).toHaveBeenCalledWith(
        expect.stringContaining('Template downloaded')
      );

      expect(spinnerMock.start).toHaveBeenCalledWith(
        expect.stringContaining('Extracting template')
      );
      expect(nodeUtilService.extractZip).toHaveBeenCalledWith(
        '/mock-root/../../template-latest.zip',
        '/mock-root/../../repo/latest'
      );
      expect(spinnerMock.stop).toHaveBeenCalledWith(
        expect.stringContaining('Template extracted')
      );
    });

    it('should skip downloading latest template if already downloaded', async () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((path: PathLike) => {
        if (
          path === '/mock-cwd/mock-name' ||
          path === '/mock-root/../../repo/latest'
        ) {
          return false;
        }
        return true;
      });

      const { command, nodeUtilService, spinnerMock } = setup();

      await expect(
        command.createApp({ name: 'mock-name', preset: OryxPreset.B2C })
      ).resolves.toBeUndefined();

      expect(spinnerMock.start).not.toHaveBeenCalledWith(
        expect.stringContaining('Downloading latest template')
      );
      expect(nodeUtilService.downloadFile).not.toHaveBeenCalled();
      expect(spinnerMock.stop).not.toHaveBeenCalledWith(
        expect.stringContaining('Template downloaded')
      );

      expect(spinnerMock.start).toHaveBeenCalledWith(
        expect.stringContaining('Extracting template')
      );
      expect(nodeUtilService.extractZip).toHaveBeenCalled();
      expect(spinnerMock.stop).toHaveBeenCalledWith(
        expect.stringContaining('Template extracted')
      );
    });

    it('should skip downloading and extracting latest template if already extracted', async () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((path: PathLike) => {
        if (path === '/mock-cwd/mock-name') {
          return false;
        }
        return true;
      });

      const { command, nodeUtilService, spinnerMock } = setup();

      await expect(
        command.createApp({ name: 'mock-name', preset: OryxPreset.B2C })
      ).resolves.toBeUndefined();

      expect(spinnerMock.start).not.toHaveBeenCalledWith(
        expect.stringContaining('Downloading latest template')
      );
      expect(nodeUtilService.downloadFile).not.toHaveBeenCalled();
      expect(spinnerMock.stop).not.toHaveBeenCalledWith(
        expect.stringContaining('Template downloaded')
      );

      expect(spinnerMock.start).not.toHaveBeenCalledWith(
        expect.stringContaining('Extracting template')
      );
      expect(nodeUtilService.extractZip).not.toHaveBeenCalled();
      expect(spinnerMock.stop).not.toHaveBeenCalledWith(
        expect.stringContaining('Template extracted')
      );
    });

    it('should copy template to app directory', async () => {
      const { command, nodeUtilService, spinnerMock } = setup();

      await expect(
        command.createApp({ name: 'mock-name', preset: OryxPreset.B2C })
      ).resolves.toBeUndefined();

      expect(spinnerMock.start).toHaveBeenCalledWith(
        expect.stringContaining('Copying template')
      );
      expect(nodeUtilService.copyFolder).toHaveBeenCalledWith(
        '/mock-root/../../repo/latest/oryx-development/apps/storefront',
        '/mock-cwd/mock-name'
      );
      expect(spinnerMock.stop).toHaveBeenCalledWith(
        expect.stringContaining('Template copied')
      );
    });
  });
});
