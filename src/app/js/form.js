function createFormData() {
  const form = document.querySelector('form');

  const customerType = form.querySelector('select#customer-type').value;
  const market = form.querySelector('select#country').value;
  const name = form.querySelector('input#input-name').value;
  const email = form.querySelector('input#input-email').value;
  const phone = form.querySelector('input#input-phone').value;
  const street = form.querySelector('input#input-street').value;
  const city = form.querySelector('input#input-city').value;

  const cartProducts = getStorage().split(',');
  const totalPrice = (() => {
    let price = 0;

    cartProducts.forEach((productId) => {
      const item = products.filter((p) => p.sku === productId)[0];
      price += item.price.usd;
    });

    return parseInt(price + '00'); // Total price in cents
  })();

  return {
    customerType,
    market,
    name,
    email,
    phone,
    street,
    city,
    market,
    totalPrice,
    products: getStorage()
  };
}

function validateForm() {
  const form = document.querySelector('form');

  const customerType = form.querySelector('select#customer-type').checkValidity();
  const market = form.querySelector('select#country').checkValidity();
  const name = form.querySelector('input#input-name').checkValidity();
  const email = form.querySelector('input#input-email').checkValidity();
  const phone = form.querySelector('input#input-phone').checkValidity();
  const street = form.querySelector('input#input-street').checkValidity();
  const city = form.querySelector('input#input-city').checkValidity();
  const orgNumber = form.querySelector('input#input-orgnumber').checkValidity();

  if (customerType && market && name && email && phone && street && city) {
    const _customerType = form.querySelector('select#customer-type').value;
    console.log('_customerType', _customerType);
    if (_customerType === 'B2C') return true;

    // Only check organization number for B2B customers
    if (orgNumber) return true;
  }
  return false;
}

async function submitForm() {
  if (!validateForm()) return;

  // Call payment service, which links to Payment Provider; on success send back data
  return await fetch(CREATE_ORDER_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(createFormData())
  })
    // Parse JSON response
    .then((res) => res.json())
    // Redirect to success screen
    .then((res) => {
      if (!res.redirectUrl) throw new Error('No valid response!');
      window.location.href = `${window.location.origin}${res.redirectUrl}.html`;
    })
    // Handle errors
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });
}
