import { resolve } from '@spryker-oryx/injector';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { ExperienceService } from '../services';
import { ContentController } from './content.controller';

const mockObserveGet = vi.fn();
const mockGetContent = vi.fn();
const mockUid = 'mockUid';
const mockContent = {
  data: 'mockContent',
};
const mockObserve = {
  key: 'mockContent',
};

vi.mock('@spryker-oryx/lit-rxjs', () => ({
  ObserveController: vi.fn((data) => {
    if (data.content) {
      return {
        get: mockObserveGet.mockReturnValue(of(mockObserve)),
      };
    }

    return {
      get: mockObserveGet.mockImplementation((key) => {
        if (key !== 'content' && !data.noKey) {
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
    };
  }),
}));

describe('ContentController', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should expose content directly if content exist', () => {
    const contentController = new ContentController({
      content: true,
    } as unknown as LitElement);

    const callback = vi.fn();
    contentController.getContent().subscribe(callback);

    expect(resolve).toHaveBeenCalledWith(
      contentController,
      ExperienceService,
      null
    );
    expect(mockObserveGet).toHaveBeenCalledWith('content');
    expect(callback).toHaveBeenCalledWith(mockObserve);
  });

  it('should expose content from service by uid', () => {
    const contentController = new ContentController({
      content: false,
    } as unknown as LitElement);

    const callback = vi.fn();
    contentController.getContent().subscribe(callback);

    expect(resolve).toHaveBeenCalledWith(
      contentController,
      ExperienceService,
      null
    );
    expect(mockObserveGet).toHaveBeenNthCalledWith(1, 'content');
    expect(mockObserveGet).toHaveBeenNthCalledWith(2, 'uid');
    expect(mockGetContent).toHaveBeenCalledWith({
      key: mockUid,
    });
    expect(callback).toHaveBeenCalledWith(mockContent.data);
  });

  it('should emit `undefined` if content, uid and ExperienceService are not defined', () => {
    const contentController = new ContentController({
      content: false,
      noExperienceService: true,
      noKey: true,
    } as unknown as LitElement);

    const callback = vi.fn();
    contentController.getContent().subscribe(callback);

    expect(resolve).toHaveBeenCalledWith(
      contentController,
      ExperienceService,
      null
    );
    expect(mockObserveGet).toHaveBeenNthCalledWith(1, 'content');
    expect(mockObserveGet).toHaveBeenNthCalledWith(2, 'uid');
    expect(mockGetContent).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(undefined);
  });
});
