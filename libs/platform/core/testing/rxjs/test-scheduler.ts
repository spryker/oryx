import { TestScheduler } from 'rxjs/testing';

export const rxjsTestScheduler: () => TestScheduler = () =>
  new TestScheduler((actual, expected) => {
    try {
      expect(actual).toEqual(expected);
    } catch (e) {
      console.error('Expected:', expected);
      console.error('Actual:', actual);
      throw e;
    }
  });
