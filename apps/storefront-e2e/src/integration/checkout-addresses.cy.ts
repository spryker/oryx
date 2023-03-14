import { defaultUser } from "../support/commands"
import { SCCOSApi } from "../support/sccos_api/sccos.api"

describe('User addresses manipulations on Checkout page', () => {
  beforeEach(() => {
    const api = new SCCOSApi();

    cy.login(defaultUser);
    cy.customerAddressesCleanup(api, defaultUser);

    api.addresses.post(defaultUser.id)
    api.addresses.get(defaultUser.id)
  })

  it('must allow user to see a list of addresses', () => {
    // check that new address is visible
    // check that Change button is visible
  })

  it('must allow user to create new address if he already has one', () => {
    // click on change button
    // add new address (set it both default and billing address)
    // check that it appeared in 2 lists
  })

  it('must allow user to edit an existing address', () => {
    // edit first address in the list
    // check that it was updated in 2 lists
  })

  it('must allow user to delete existing address', () => {
    // delete first address in the list
    // check that it dissapeared from 2 lists
  })
})