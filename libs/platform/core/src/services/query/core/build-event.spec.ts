import { QueryEvent } from '../models';
import { buildEvent } from './build-event';

describe('buildEvent', () => {
  const qualifier = { key: 'value' };
  const data = { value: 'data' };
  const error = new Error('Something went wrong');

  it('should return the result of the handler if it is a function', () => {
    const handler = vi.fn().mockReturnValueOnce('test');
    const result = buildEvent(handler, qualifier, data, error);
    expect(handler).toHaveBeenCalledWith({ data, qualifier });
    expect(result).toEqual('test');
  });

  it('should return a QueryEvent object if the handler is a string', () => {
    const handler = 'some-event';
    const result = buildEvent(handler, qualifier, data, error);
    const expected: QueryEvent<typeof data, typeof qualifier> = {
      type: handler,
      qualifier,
      data,
      error,
    };
    expect(result).toEqual(expected);
  });
});
