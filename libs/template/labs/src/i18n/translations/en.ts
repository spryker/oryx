const product = {
  'product.availability.none': 'Not available',
  'product.availability.limited': 'Limited availability',
  'product.availability.limited-<stock>':
    'Limited availability ({stock, plural, one {one product} other {{stock} products}})',
  'product.availability.available': 'Available online',
  'product.availability.available-<stock>':
    'Available online ({stock, plural, one {one product} other {{stock} products}})',
};

const carts = {
  'carts.totals.<count>-carts':
    'My carts ({count, plural, one {1 cart} other {{count} carts}})',
  'carts.totals.<count>-items':
    '({count, plural, 0 {empty} one {1 item} other {{count} items}})',
  'carts.list.no-cart-entries':
    'There are no cart entries for this cart available.',
  'carts.price-mode.gross': '( Gross )',
  'carts.price-mode.net': '( Net )',
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
  'oauth.logging-you-in': 'Logging you in...',
};

const coupon = {
  'coupon.have-a-coupon': 'Have a coupon?',
  'coupon.insert': 'Please insert a coupon code',
  'coupon.invalid': 'Coupon code can not be added',
  'coupon.(valid-till-<date>)': '(valid till {date})',
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
    'Removing this address will not remove any pending orders being dispatched to this` address',
};

const picking = {
  'picking.product-card.of-<count>-items':
    'Of {count, plural, one {{count} item} other {{count} items}}',
  'picking.filter.<count>-open-pick-lists':
    '{count} Open Pick {count, plural, one {List} other {Lists}}',
  'picking.select-your-location': 'Select your location to get started',
  'picking.discard.pick-list': 'Discard pick list?',
  'picking.discard.stop-picking': 'Stop picking and discard pick list?',
  'picking.discard.warning': 'The pick list will be lost!',
  'picking.processed.success': 'Great job!',
  'picking.processed.all': 'All items are processed!',
  'picking.location.loading': 'Loading locations',
  'picking.location.unassigned': 'You are not assigned to any locations',
  'picking.location.help': 'Please reach out to your manager',
  'picking.location.select': 'Select your location',
};

const ui = {
  'ui.password.at-least-<count>-characters':
    'At least {count, plural, one {{count} character} other {{count} characters}}',
  'ui.password.at-most-<count>-characters':
    'At most {count, plural, one {{count} character} other {{count} characters}}',
  'ui.password.at-least-<count>-uppercase-letters':
    'At least {count, plural, one {{count} uppercase letter} other {{count} uppercase letters}}',
  'ui.password.at-least-<count>-numbers':
    'At least {count, plural, one {{count} number} other {{count} numbers}}',
  'ui.password.at-least-<count>-special-chars':
    'At least {count, plural, one {{count} special character} other {{count} special characters}} (e.g. *$%)',
};

const search = {
  'search.facet.rating.up': '& up',
};

const merchant = {
  'merchant.schedule.weekdays': 'Opening hours',
  'merchant.schedule.dates': 'Upcoming dates',
  'merchant.schedule.<note>': '({note})',
  'merchant.schedule.<date>-<note>': '{date} ({note})',
};

export default {
  ...product,
  ...cart,
  ...carts,
  ...coupon,
  ...checkout,
  ...order,
  ...user,
  ...picking,
  ...ui,
  ...search,
  ...merchant,
};
