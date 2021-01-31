const getDeliveryTimes = async () =>
  await fetch(DELIVERY_TIMES_ENDPOINT)
    // Parse and return JSON response
    .then((res) => res.json())
    .then((res) => res.deliveryOptions)
    // Handle errors
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });

const bookDelivery = async ({ orderId, deliveryTime }) =>
  await fetch(BOOK_DELIVERY_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      orderId,
      deliveryTime
    })
  })
    // Parse and return JSON response
    .then((res) => res.json())
    // Handle errors
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });

function renderButtons(deliveryOptions) {
  let html = '';

  deliveryOptions.forEach((timeslot) => {
    const time = new Date(parseFloat(timeslot)).toLocaleDateString('se-sv', {
      hour: '2-digit',
      minute: '2-digit'
    });
    html += `<button id="${timeslot}">${time}</button>`;
  });

  APP.querySelector('#timeslots').innerHTML = html;
}
