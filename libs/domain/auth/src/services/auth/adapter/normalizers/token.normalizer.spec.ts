import { tokenAttributesNormalizer } from './token.normalizer';

const date = Date.now();

const mockSource = {
  access_token: 'mocktoken',
  token_type: 'mock',
  expires_in: 1000,
  refresh_token: 'mockrefresh',
  refreshTokenExpiresAt: date,
};

describe('Token Normalizers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(date);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('When receiving a token', () => {
    it('should normalize access token', () => {
      const mockResult = {
        accessToken: mockSource.access_token,
        tokenType: mockSource.token_type,
        expiresAt: date + mockSource.expires_in * 1000,
        refreshToken: mockSource.refresh_token,
        refreshTokenExpiresAt: date * 1000,
      };
      const normalized = tokenAttributesNormalizer({ ...mockSource });
      expect(normalized).toEqual(mockResult);
    });
  });
});
