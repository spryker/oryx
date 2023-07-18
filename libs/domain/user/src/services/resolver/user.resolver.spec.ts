import { TokenResourceResolvers } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { User, UserService } from '@spryker-oryx/user';
import { BehaviorSubject } from 'rxjs';
import { UserResolver, UserResourceResolver } from './user.resolver';

const emptyUser = {};

const userWithName = {
  firstName: 'test',
};

const userObservable = new BehaviorSubject<Partial<User> | null>(null);
class MockUserService implements Partial<UserService> {
  getUser = vi.fn().mockReturnValue(userObservable);
}

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: UserService,
          useClass: MockUserService,
        },
        UserResourceResolver,
      ],
    });

    resolver = testInjector.inject(`${TokenResourceResolvers}USER`);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('NAME', () => {
    const expectedResult = (
      description: string,
      expectation: null | string,
      user: Partial<User> | null = null
    ) => {
      describe(description, () => {
        const callback = vi.fn();
        beforeEach(() => {
          userObservable.next(user);
          resolver.resolve('NAME').subscribe(callback);
        });

        it(`should return ${expectation}`, () => {
          expect(callback).toHaveBeenCalledWith(expectation);
        });
      });
    };

    expectedResult('when user is not ready', '');
    expectedResult('when user does not have firstName', '', emptyUser);
    expectedResult(
      'when user has firstName',
      userWithName.firstName,
      userWithName
    );
  });

  describe('AUTHENTICATED', () => {
    const expectedResult = (
      description: string,
      expectation: boolean,
      user: Partial<User> | null = null
    ) => {
      describe(description, () => {
        const callback = vi.fn();
        beforeEach(() => {
          userObservable.next(user);
          resolver.resolve('AUTHENTICATED').subscribe(callback);
        });

        it(`should return ${expectation}`, () => {
          expect(callback).toHaveBeenCalledWith(expectation);
        });
      });
    };

    expectedResult('when has no user profile', false);
    expectedResult('when user profile is provided', true, userWithName);
  });
});
