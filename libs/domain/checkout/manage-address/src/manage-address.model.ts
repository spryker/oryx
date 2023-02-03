import { AddressBookState } from '@spryker-oryx/user/address-book';
import { DirectiveResult } from 'lit-html/directive';

export type AddressModalConfig = {
  [key in AddressBookState]: {
    heading: string | DirectiveResult;
  };
};
