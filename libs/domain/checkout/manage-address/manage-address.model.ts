import { AddressBookState } from '@spryker-oryx/user/address-book';
import { DirectiveResult } from 'lit/directive';

export type AddressModalConfig = {
  [key in AddressBookState]: {
    heading: string | DirectiveResult;
  };
};
