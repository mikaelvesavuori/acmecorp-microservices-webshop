/**
 * CONSTANTS
 */
const LOCAL_STORAGE_NAMESPACE = 'acmecorpdemo';

/**
 * LOCALSTORAGE-BASED CART
 */

// Public
function updateCart(item) {
  if (!item) throw new Error('updateCart: Missing item!');

  setStorage(item);
  updateButtonState(item);
  updateCartCount();

  // Remove product if user is on cart page
  const isOnCartPage = window.location.pathname.includes('cart.html');
  if (isOnCartPage) {
    const product = document.querySelector(`#product-${item}`);
    product.parentNode.removeChild(product);
  }
}

// Internal
function getStorage() {
  return localStorage.getItem(LOCAL_STORAGE_NAMESPACE);
}

// Internal
function setStorage(item) {
  if (!item) throw new Error('setStorage: Missing item!');
  let ls = getStorage(item);

  // No localStorage, create new from scratch
  if (!ls) localStorage.setItem(LOCAL_STORAGE_NAMESPACE, item);
  // Item is already in cart: remove it
  else if (ls && ls.includes(item)) {
    let newStorageString = ls
      .replace(`,${item}`, '')
      .replace(`${item},`, '')
      .replace(`${item}`, '');
    localStorage.setItem(LOCAL_STORAGE_NAMESPACE, newStorageString);
  }
  // Item is not in cart: add it
  else localStorage.setItem(LOCAL_STORAGE_NAMESPACE, `${ls},${item}`);
}

/**
 * STATE MANAGEMENT
 */
function updateButtonState(productSku) {
  const product = products.filter((product) => product.sku === productSku)[0];
  if (!product) return;

  const price = product.price.usd;
  const button = document.querySelector(`#product-${productSku} button`);
  button.classList.toggle('inCart');

  button.classList.contains('inCart')
    ? (button.innerText = 'In cart — Remove?')
    : (button.innerText = `${price} $`);
}

function updateCartCount(add = true) {
  const ls = getStorage();

  const count = (() => {
    if (!ls) return 0;
    return ls.split(',').length;
  })();

  const cartCount = document.querySelector('#cart-itemcount');
  if (cartCount) document.querySelector('#cart-itemcount').innerText = count;
}

function updateCustomerTypeOptions() {
  const countrySelector = document.querySelector('select#country');
  const customerValue = document.querySelector('select#customer-type').value;

  const orgNumberField = document.querySelector('div#orgnumber');
  orgNumberField.classList.toggle('hide');

  const orgNumberInput = document.querySelector('input#input-orgnumber');
  customerValue === 'B2B'
    ? orgNumberInput.setAttribute('required', true)
    : orgNumberInput.removeAttribute('required');

  if (customerValue === 'B2B')
    countrySelector.innerHTML = `<option value="US">United States</option>`;
  else if (customerValue === 'B2C')
    countrySelector.innerHTML = `<option value="US">United States</option><option value="MX">Mexico</option>`;
  else console.error('Invalid value!');
}

function updateCountryOptions() {
  const customerTypeSelector = document.querySelector('select#customer-type');
  const countryValue = document.querySelector('select#country').value;

  if (countryValue === 'US')
    customerTypeSelector.innerHTML = `<option value="B2C">Individual</option><option value="B2B">Business</option>`;
  else if (countryValue === 'MX')
    customerTypeSelector.innerHTML = `<option value="B2C">Individual</option>`;
  else console.error('Invalid value!');
}
