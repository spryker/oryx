import { Address } from '../models';

export function formatAddress(address: Address): string {
  return `
    ${address.salutation}. ${address.firstName} ${address.lastName},
    ${address?.company ? `${address.company},` : ''}
    ${address.address1} ${address.address2} ${address?.address3},
    ${address.zipCode} ${address.city},
    ${address?.country}
    `;
}
