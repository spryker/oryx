import { fromFetch } from 'rxjs/fetch';
import { DefaultHttpService } from './default-http.service';
import { HttpService } from './http.service';

vi.mock('rxjs/fetch', () => ({
  fromFetch: vi.fn(),
}));

const mockUrl = 'mockUrl';
const mockHeaders = {
  custom: 'custom',
};
const mockOptions = {
  keepalive: true,
  headers: mockHeaders,
};
const mockBody = {
  test: 'test',
};

describe('DefaultHttpService', () => {
  let service: HttpService;

  beforeEach(() => {
    service = new DefaultHttpService();
  });

  it('request method should call `fromFetch` with proper parameters', () => {
    service.request(mockUrl, mockOptions);

    expect(fromFetch).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      headers: mockHeaders,
      selector: expect.any(Function),
    });
  });

  it('get method should call `fromFetch` with proper parameters', () => {
    service.get(mockUrl, mockOptions);

    expect(fromFetch).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      method: 'GET',
      headers: mockHeaders,
      selector: expect.any(Function),
    });
  });

  it('post method should call `fromFetch` with proper parameters', () => {
    service.post(mockUrl, mockBody, mockOptions);

    expect(fromFetch).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...mockHeaders,
      },
      body: JSON.stringify(mockBody),
      selector: expect.any(Function),
    });
  });

  it('patch method should call `fromFetch` with proper parameters', () => {
    service.patch(mockUrl, mockBody, mockOptions);

    expect(fromFetch).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...mockHeaders,
      },
      body: JSON.stringify(mockBody),
      selector: expect.any(Function),
    });
  });
});
