import { NodeUtilService } from './node-util.service';

describe('NodeUtilService', () => {
  class MockFs {
    createWriteStream = vi.fn();
    createReadStream = vi.fn();
    unlink = vi.fn();
    existsSync = vi.fn();
    mkdirSync = vi.fn();
    readdirSync = vi.fn();
    statSync = vi.fn();
    copyFileSync = vi.fn();
  }

  class MockUnzipper {
    Extract = vi.fn();
  }

  function setup() {
    const mockFs = new MockFs();
    const mockRequest = vi.fn();
    const mockUnzipper = new MockUnzipper();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const service = new NodeUtilService(
      mockFs as any,
      undefined,
      mockRequest as any,
      mockUnzipper as any
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return { service, mockFs, mockRequest, mockUnzipper };
  }

  it('should be created', () => {
    const { service } = setup();

    expect(service).toBeTruthy();
  });

  describe('downloadFile() method', () => {
    function caseSetup() {
      const ctx = setup();

      const mockWriteStream = { on: vi.fn().mockReturnThis() };
      const requestPipe = vi.fn().mockReturnValue(mockWriteStream);

      ctx.mockFs.createWriteStream.mockReturnValue('mock-write-stream');
      ctx.mockRequest.mockReturnValue({ pipe: requestPipe });

      return { ...ctx, mockWriteStream, requestPipe };
    }

    it('should download a file', async () => {
      const { service, mockRequest, mockFs, mockWriteStream, requestPipe } =
        caseSetup();

      service.downloadFile('file-url', 'file-path');

      expect(mockRequest).toHaveBeenCalledWith('file-url');
      expect(mockFs.createWriteStream).toHaveBeenCalledWith('file-path', {
        autoClose: true,
      });
      expect(requestPipe).toHaveBeenCalledWith('mock-write-stream');
      expect(mockWriteStream.on).toHaveBeenCalledWith(
        'close',
        expect.any(Function)
      );
      expect(mockWriteStream.on).toHaveBeenCalledWith(
        'error',
        expect.any(Function)
      );
    });

    it('should resolve when the file is downloaded', async () => {
      const { service, mockWriteStream } = caseSetup();

      const promise = service.downloadFile('file-url', 'file-path');

      // Call the close callback
      mockWriteStream.on.mock.calls[0][1]();

      await expect(promise).resolves.toBeUndefined();
    });

    it('should reject when the file fails to download', async () => {
      const { service, mockWriteStream, mockFs } = caseSetup();

      const promise = service.downloadFile('file-url', 'file-path');

      // Call the error callback
      mockWriteStream.on.mock.calls[1][1]('mock-error');

      expect(mockFs.unlink).toHaveBeenCalledWith(
        'file-path',
        expect.any(Function)
      );

      // Call the fs.unlink callback
      mockFs.unlink.mock.calls[0][1]();

      await expect(promise).rejects.toBe('mock-error');
    });
  });

  describe('extractZip() method', () => {
    function caseSetup() {
      const ctx = setup();

      const mockPipe = { on: vi.fn().mockReturnThis() };
      const mockReadStream = { pipe: vi.fn().mockReturnValue(mockPipe) };

      ctx.mockFs.createReadStream.mockReturnValue(mockReadStream);
      ctx.mockUnzipper.Extract.mockReturnValue('mock-extract');

      return { ...ctx, mockReadStream, mockPipe };
    }

    it('should extract a zip file', async () => {
      const { service, mockFs, mockReadStream, mockPipe, mockUnzipper } =
        caseSetup();

      service.extractZip('zip-file-path', 'extract-to-dir');

      expect(mockFs.createReadStream).toHaveBeenCalledWith('zip-file-path');
      expect(mockUnzipper.Extract).toHaveBeenCalledWith({
        path: 'extract-to-dir',
      });
      expect(mockReadStream.pipe).toHaveBeenCalledWith('mock-extract');
      expect(mockPipe.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(mockPipe.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should resolve when the zip file is extracted', async () => {
      const { service, mockPipe: mockExtract } = caseSetup();

      const promise = service.extractZip('zip-file-path', 'extract-to-dir');

      // Call the close callback
      mockExtract.on.mock.calls[0][1]();

      await expect(promise).resolves.toBeUndefined();
    });

    it('should reject when the zip file fails to extract', async () => {
      const { service, mockPipe: mockExtract } = caseSetup();

      const promise = service.extractZip('zip-file-path', 'extract-to-dir');

      // Call the error callback
      mockExtract.on.mock.calls[1][1]('mock-error');

      await expect(promise).rejects.toBe('mock-error');
    });
  });

  describe('copyFolder() method', () => {
    function caseSetup() {
      const ctx = setup();

      return { ...ctx };
    }

    it('should create the destination folder if it does not exist', async () => {
      const { service, mockFs } = caseSetup();

      mockFs.readdirSync.mockReturnValue([]);
      mockFs.statSync.mockReturnValue({ isDirectory: () => false });
      mockFs.existsSync.mockReturnValue(false);

      await service.copyFolder('/source', '/destination');

      expect(mockFs.mkdirSync).toHaveBeenCalledWith('/destination', {
        recursive: true,
      });
    });

    it('should copy a folder recursively', async () => {
      const { service, mockFs } = caseSetup();

      mockFs.readdirSync.mockImplementation((path: string) => {
        if (path === '/source') {
          return ['file1', 'file2', 'dir1', 'file3'];
        }

        if (path === '/source/dir1') {
          return ['file4', 'file5', 'dir2'];
        }

        return [];
      });

      mockFs.statSync.mockImplementation((path: string) => {
        if (path.match(/dir\d+$/)) {
          return { isDirectory: () => true };
        } else {
          return { isDirectory: () => false };
        }
      });

      mockFs.existsSync.mockImplementation((path: string) => {
        if (path === '/destination') {
          return true;
        }

        return false;
      });

      service.copyFolder('/source', '/destination');

      // Wait for the recursive async calls to finish
      await new Promise((resolve) => setTimeout(resolve));

      expect(mockFs.mkdirSync).not.toHaveBeenCalledWith('/destination', {
        recursive: true,
      });
      expect(mockFs.readdirSync).toHaveBeenCalledWith('/source');

      const files = ['file1', 'file2', 'file3', 'dir1/file4', 'dir1/file5'];
      files.forEach((file) =>
        expect(mockFs.copyFileSync).toHaveBeenCalledWith(
          `/source/${file}`,
          `/destination/${file}`
        )
      );

      const dirs = ['dir1', 'dir1/dir2'];
      dirs.forEach((dir) => {
        expect(mockFs.mkdirSync).toHaveBeenCalledWith(`/destination/${dir}`, {
          recursive: true,
        });
        expect(mockFs.readdirSync).toHaveBeenCalledWith(`/source/${dir}`);
      });
    });

    it('should resolve when the folder is copied', async () => {
      const { service, mockFs } = caseSetup();

      mockFs.readdirSync.mockReturnValue(['file1']);
      mockFs.statSync.mockReturnValue({ isDirectory: () => false });

      const promise = service.copyFolder('/source', '/destination');

      await expect(promise).resolves.toBeUndefined();
    });

    it('should reject when the folder fails to copy', async () => {
      const { service, mockFs } = caseSetup();

      mockFs.readdirSync.mockReturnValue(['file1']);
      mockFs.statSync.mockReturnValue({ isDirectory: () => false });

      mockFs.copyFileSync.mockImplementation(() => {
        throw new Error('mock-error');
      });

      const promise = service.copyFolder('source', 'destination');

      await expect(promise).rejects.toEqual(new Error('mock-error'));
    });
  });
});
