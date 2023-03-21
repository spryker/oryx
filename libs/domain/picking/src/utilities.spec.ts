import { formatTime } from './utilities';

describe('Utilities', () => {
  describe('formatTime', () => {
    it('should return correct time', () => {
      expect(formatTime(new Date('2023-03-21 14:31:44'))).toBe('02:31 pm');
    });
  });
});
