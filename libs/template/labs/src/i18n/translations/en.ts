const product = {
  'product.availability.none': 'Not available',
  'product.availability.limited': 'Limited availability',
  'product.availability.limited-<stock>':
    'Limited availability ({stock, plural, one {one product} other {{stock} products}})',
  'product.availability.available': 'Available online',
  'product.availability.available-<stock>':
    'Available online ({stock, plural, one {one product} other {{stock} products}})',
};

const cart = {
  'cart.totals.<count>-items':
    'My cart ({count, plural, one {one item} other {{count} items}})',
  'cart.totals.<count>-discounts':
    '{count, plural, one {Discount} other {Discounts}}',
  'cart.totals.unknown-delivery-cost':
    'Delivery costs will be calculated at checkout',
  'cart.entry.<quantity>-items': 'x {quantity}',
  'cart.entry.confirm-remove-<sku>': 'Do you want to remove "{sku}"?',
  'cart.confirm-removed': 'Item is successfully removed',
  'login.welcome-please-log-in-to-start-picking':
    'Welcome! Please log in to start picking.',
  'oauth.logging-you-in': 'Logging you in...',
};

const checkout = {
  'checkout.guest.continue-without-account':
    'You can checkout without creating an account. You will have a chance to create an account later.',
  'checkout.totals.<count>-items':
    'Products ({count, plural, one {one item} other {{count} items}})',
};

const order = {
  'order.<count>-items':
    'Products ({count, plural, one {{count} item} other {{count} items}})',
};

const user = {
  'user.address.remove-info':
    'Removing this address will not remove any pending orders being dispatched to this address',
};

const picking = {
  'picking.product-card.of-<count>-items':
    'Of {count, plural, one {{count} item} other {{count} items}}',
  'picking.filter.<count>-open-pick-lists':
    '{count} Open Pick {count, plural, one {List} other {Lists}}',
};

export default {
  ...product,
  ...cart,
  ...checkout,
  ...order,
  ...user,
  ...picking,
};
