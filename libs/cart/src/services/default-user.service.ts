import { defer, Observable, of } from 'rxjs';
import { UserData, UserService } from './user.service';

const getRandomIntFromRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomString = (): string => {
  return Math.random().toString(getRandomIntFromRange(16, 36)).substring(2);
};

const generateID = (num = 1): string => {
  return Array.from({ length: Math.abs(Number(num)) || 1 }, getRandomString)
    .join('-')
    .toUpperCase();
};

export class DefaultUserService implements UserService {
  private sessionKey = 'user';
  private userData$ = defer(() => of(this.getUser()));

  get(): Observable<UserData> {
    return this.userData$;
  }

  private getUser(): UserData {
    const sessionData = window.sessionStorage.getItem(this.sessionKey);

    if (sessionData !== null) {
      return JSON.parse(sessionData);
    }

    const data = {
      anonymousUserId: generateID(8),
    };

    window.sessionStorage.setItem(this.sessionKey, JSON.stringify(data));

    return data;
  }
}
