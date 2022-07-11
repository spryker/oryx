import { resolve } from '@spryker-oryx/injector';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { ExperienceService } from '../services';
import { ContentController } from './content.controller';

const mockObserveGet = vi.fn();
const mockGetContent = vi.fn();
const mockGetOptions = vi.fn();
const mockUid = 'mockUid';
const mockContent = {
  data: 'mockContent',
};
const mockOptions = {
  data: 'mockContent',
};
const mockObserve = {
  id: 'mockContent',
};

vi.mock('@spryker-oryx/lit-rxjs', () => ({
  ObserveController: vi.fn((data) => {
    if (data.content || data.options) {
      return {
        get: mockObserveGet.mockReturnValue(of(mockObserve)),
      };
    }

    return {
      get: mockObserveGet.mockImplementation((key) => {
        if (key !== 'content' && key !== 'options' && !data.noKey) {
          return of(mockUid);
        }

        return of(undefined);
      }),
    };
  }),
}));

vi.mock('@spryker-oryx/injector', () => ({
  resolve: vi.fn().mockImplementation((data) => {
    if (data.noExperienceService) {
      return null;
    }

    return {
      getContent: (data: unknown) =>
        mockGetContent.mockReturnValue(of(mockContent))(data),
      getOptions: (data: unknown) =>
        mockGetOptions.mockReturnValue(of(mockOptions))(data),
    };
  }),
}));

describe('ContentController', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should expose content and options directly if content exist', () => {
    const contentController = new ContentController({
      content: true,
      options: true,
    } as unknown as LitElement);

    const callbackContent = vi.fn();
    const callbackOptions = vi.fn();
    contentController.getContent().subscribe(callbackContent);
    contentController.getOptions().subscribe(callbackOptions);

    expect(resolve).toHaveBeenCalledWith(ExperienceService, null);
    expect(mockObserveGet).toHaveBeenCalledWith('content');
    expect(mockObserveGet).toHaveBeenCalledWith('options');
    expect(callbackContent).toHaveBeenCalledWith(mockObserve);
    expect(callbackOptions).toHaveBeenCalledWith(mockObserve);
  });

  it('should expose content from service by uid', () => {
    const contentController = new ContentController({
      content: false,
      options: false,
    } as unknown as LitElement);

    const callbackContent = vi.fn();
    contentController.getContent().subscribe(callbackContent);

    expect(resolve).toHaveBeenCalledWith(ExperienceService, null);
    expect(mockObserveGet).toHaveBeenNthCalledWith(1, 'content');
    expect(mockObserveGet).toHaveBeenNthCalledWith(2, 'uid');
    expect(mockGetContent).toHaveBeenCalledWith({
      uid: mockUid,
    });
    expect(callbackContent).toHaveBeenCalledWith(mockContent.data);
  });

  it('should expose options from service by uid', () => {
    const contentController = new ContentController({
      content: false,
      options: false,
    } as unknown as LitElement);

    const callbackOptions = vi.fn();
    contentController.getOptions().subscribe(callbackOptions);

    expect(resolve).toHaveBeenCalledWith(ExperienceService, null);
    expect(mockObserveGet).toHaveBeenNthCalledWith(1, 'options');
    expect(mockObserveGet).toHaveBeenNthCalledWith(2, 'uid');
    expect(mockGetOptions).toHaveBeenCalledWith({
      uid: mockUid,
    });
    expect(callbackOptions).toHaveBeenCalledWith(mockOptions.data);
  });

  it('should emit `empty object` if content, options, uid and ExperienceService are not defined', () => {
    const contentController = new ContentController({
      content: false,
      options: false,
      noExperienceService: true,
      noKey: true,
    } as unknown as LitElement);

    const callbackContent = vi.fn();
    const callbackOptions = vi.fn();
    contentController.getContent().subscribe(callbackContent);
    contentController.getOptions().subscribe(callbackOptions);

    expect(resolve).toHaveBeenCalledWith(ExperienceService, null);
    expect(mockObserveGet).toHaveBeenNthCalledWith(1, 'content');
    expect(mockObserveGet).toHaveBeenNthCalledWith(2, 'uid');
    expect(mockObserveGet).toHaveBeenNthCalledWith(3, 'options');
    expect(mockObserveGet).toHaveBeenNthCalledWith(4, 'uid');
    expect(mockGetContent).not.toHaveBeenCalled();
    expect(mockGetOptions).not.toHaveBeenCalled();
    expect(callbackContent).toHaveBeenCalledWith(undefined);
    expect(callbackOptions).toHaveBeenCalledWith({});
  });
});
