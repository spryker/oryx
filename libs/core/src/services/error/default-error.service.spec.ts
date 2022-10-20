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

  it('should add event "error" listener', () => {
    service.initialize();
    expect(mockWindow.addEventListener).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    );
  });

  it('should add event "unhandledrejection" listener', () => {
    service.initialize();
    expect(mockWindow.addEventListener).toHaveBeenCalledWith(
      'unhandledrejection',
      expect.any(Function)
    );
  });

  it('should trigger "error" listener', () => {
    service.initialize();

    const errorCallback = mockWindow.addEventListener.mock.calls[0][1];
    const mockError = {};
    errorCallback(mockError);

    expect(testErrorHandler.handle).toHaveBeenCalledWith(mockError);
  });

  it('should trigger "unhandledrejection" listener', () => {
    service.initialize();

    const errorCallback = mockWindow.addEventListener.mock.calls[1][1];
    const mockError = {};
    errorCallback(mockError);

    expect(testErrorHandler.handle).toHaveBeenCalledWith(mockError);
  });

  it('should remove "error" listener', () => {
    service.initialize();
    service.onDestroy();

    const errorCallback = mockWindow.addEventListener.mock.calls[0][1];

    expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
      'error',
      errorCallback
    );
  });

  it('should remove "unhandledrejection" listener', () => {
    service.initialize();
    service.onDestroy();

    const errorCallback = mockWindow.addEventListener.mock.calls[1][1];

    expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
      'unhandledrejection',
      errorCallback
    );
  });
});
