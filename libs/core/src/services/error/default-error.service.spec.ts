import {
  DefaultErrorService,
  ErrorHandler,
  ErrorService,
} from '@spryker-oryx/core';

describe('DefaultHttpService', () => {
  //TODO: use global interface that contains "onDestroy" method when it will be implemented
  let service: ErrorService & { onDestroy(): void };

  class TestErrorHandler implements ErrorHandler {
    handle = vi.fn();
  }

  class MockWindow {
    addEventListener = vi.fn();
    removeEventListener = vi.fn();
  }

  let mockWindow: MockWindow;
  let testErrorHandler: TestErrorHandler;

  beforeEach(() => {
    mockWindow = new MockWindow();
    testErrorHandler = new TestErrorHandler();

    service = new DefaultErrorService(mockWindow as any, testErrorHandler);
  });

  afterEach(() => {
    service.onDestroy();
  });

  describe('when initialized', () => {
    beforeEach(() => {
      service.initialize();
    });

    it('should add event "error" listener', () => {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'error',
        expect.any(Function)
      );
    });

    it('should add event "unhandledrejection" listener', () => {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'unhandledrejection',
        expect.any(Function)
      );
    });

    it('should handle "error" event', () => {
      const errorCallback = mockWindow.addEventListener.mock.calls[0][1];
      const mockError = { mockError: true };
      const mockEvent = new ErrorEvent('error', { error: mockError });

      errorCallback(mockEvent);

      expect(testErrorHandler.handle).toHaveBeenCalledWith(mockError);
    });

    it('should handle "unhandledrejection" event', () => {
      const errorCallback = mockWindow.addEventListener.mock.calls[1][1];
      const mockError = { mockError: true };
      const mockEvent = new PromiseRejectionEvent('unhandledrejection', {
        promise: new Promise(() => void 0),
        reason: mockError,
      });

      errorCallback(mockEvent);

      expect(testErrorHandler.handle).toHaveBeenCalledWith(mockError);
    });
  });

  describe('when destroyed', () => {
    beforeEach(() => {
      service.initialize();
      service.onDestroy();
    });

    it('should remove "error" listener', () => {
      const errorCallback = mockWindow.addEventListener.mock.calls[0][1];

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'error',
        errorCallback
      );
    });

    it('should remove "unhandledrejection" listener', () => {
      const errorCallback = mockWindow.addEventListener.mock.calls[1][1];

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
        'unhandledrejection',
        errorCallback
      );
    });
  });
});
