import { JsonApiModel } from '@spryker-oryx/utilities';

export module ApiUserModel {
  export interface CreateUser {
    salutation: string;
    gender: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    acceptedTerms: boolean;
  }

  export interface User {
    firstName: string;
    lastName: string;
    email: string;
    gender?: string;
    dateOfBirth?: string;
    salutation?: string;
    createdAt?: string;
    updatedAt?: string;
    password?: string;
    confirmPassword?: string;
    acceptedTerms?: boolean;
  }

  export interface Payload {
    type: 'customers';
    id?: string;
    links?: unknown;
    attributes: Partial<User | CreateUser>;
  }

  export type Response = JsonApiModel<User, unknown>;
}
