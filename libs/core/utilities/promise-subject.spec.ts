import { PromiseSubject } from './promise-subject';

describe('PromiseSubject', () => {
  it('should construct normal Promise', () => {
    const promiseSubject = new PromiseSubject();

    expect(promiseSubject).toBeInstanceOf(Promise);
  });

  it('should run executor function like Promise', () => {
    const executor = vi.fn();

    new PromiseSubject(executor);

    expect(executor).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('should resolve promise via executor`s resolve function with a value', () => {
    const promiseSubject = new PromiseSubject((res) => res('mock'));

    expect(promiseSubject).resolves.toBe('mock');
  });

  it('should resolve promise via executor`s resolve function without a value', () => {
    const promiseSubject = new PromiseSubject<void>((res) => res());

    expect(promiseSubject).resolves.toBeUndefined();
  });

  it('should resolve promise via executor`s resolve function with another promise', () => {
    const promiseSubject = new PromiseSubject((res) =>
      res(Promise.resolve('mock'))
    );

    expect(promiseSubject).resolves.toBe('mock');
  });

  it('should reject promise via executor`s reject function with error', () => {
    const promiseSubject = new PromiseSubject((_, rej) => rej('mock'));

    expect(promiseSubject).rejects.toBe('mock');
  });

  describe('resolve() method', () => {
    it('shoud resolve promise with a value', () => {
      const promiseSubject = new PromiseSubject();

      promiseSubject.resolve('mock');

      expect(promiseSubject).resolves.toBe('mock');
    });

    it('shoud resolve promise without a value', () => {
      const promiseSubject = new PromiseSubject<void>();

      promiseSubject.resolve();

      expect(promiseSubject).resolves.toBeUndefined();
    });

    it('should resolve promise with another promise', () => {
      const promiseSubject = new PromiseSubject();

      promiseSubject.resolve(Promise.resolve('mock'));

      expect(promiseSubject).resolves.toBe('mock');
    });
  });

  describe('reject() method', () => {
    it('should reject promise with error', () => {
      const promiseSubject = new PromiseSubject();

      promiseSubject.reject('error');

      expect(promiseSubject).rejects.toBe('error');
    });
  });

  describe('asPromise() method', () => {
    it('should return a different promise', () => {
      const promiseSubject = new PromiseSubject();

      const promise = promiseSubject.asPromise();

      expect(promise).toBeInstanceOf(Promise);
      expect(promise).not.toBe(promiseSubject);
    });

    it('should resolve returned promise', () => {
      const promiseSubject = new PromiseSubject();
      const promise = promiseSubject.asPromise();

      promiseSubject.resolve('value');
      expect(promise).resolves.toBe('value');
    });

    it('should reject returned promise', () => {
      const promiseSubject = new PromiseSubject();
      const promise = promiseSubject.asPromise();

      promiseSubject.reject('error');
      expect(promise).rejects.toBe('error');
    });

    it('should NOT have subject`s methods', () => {
      const promiseSubject = new PromiseSubject();
      const promise = promiseSubject.asPromise();

      expect(promise).not.toEqual({
        resolve: expect.any(Function),
        reject: expect.any(Function),
      });
    });
  });
});
