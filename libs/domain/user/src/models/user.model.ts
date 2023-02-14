export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  salutation?: string;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  confirmPassword?: string;
  acceptedTerms?: boolean;
}
