const cart = {
  'cart.totals.<count>-items':
    'My cart ({count, plural, one {one item} other {{count} items}})',
  'cart.totals.<count>-discounts':
    '{count, plural, one {Discount} other {Discounts}}',
  'cart.entry.<quantity>-items': 'x {quantity}',
  'cart.entry.confirm-remove-<sku>': 'Do you want to remove "{sku}"?',
  'cart.confirm-removed': 'Item is successfully removed',
};

const checkout = {
  'checkout.guest.continue-without-account':
    'You can checkout without creating an account. You will have a chance to create an account later.',
};

const order = {
  'order.<count>-items':
    'Products ({count, plural, one {{count} item} other {{count} items}})',
};

export default {
  ...cart,
  ...checkout,
  ...order,
};
