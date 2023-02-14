import { mockUser } from '@spryker-oryx/user/mocks';
import { userDataNormalizer } from './user.normalizer';

describe('User Normalizers', () => {
  describe('User Normalizer', () => {
    it('should transform DeserializedUser into User', () => {
      const normalized = userDataNormalizer(mockUser);

      expect(normalized).toEqual(mockUser);
    });
  });
});
