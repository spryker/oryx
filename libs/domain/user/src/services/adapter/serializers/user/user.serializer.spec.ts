import { userAttributesSerializer } from '@spryker-oryx/user';

describe('User Serializers', () => {
  describe('User Attributes Serializer', () => {
    it('should transform User into Payload', () => {
      const mockUser = {
        salutation: 'Mr',
        gender: 'Male',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        password: '123',
      };

      const mockResult = {
        type: 'customers',
        attributes: mockUser,
      };

      expect(userAttributesSerializer(mockUser)).toEqual(mockResult);
    });
  });
});
