/**
 * @description Helper to create message content based on known transaction types
 */
export function createContent(transaction: string, data: Record<string, unknown>): any {
  if (transaction === 'OrderCreated') return createContentOrderCreated(data);
  if (transaction === 'OrderDeliverable') return createContentOrderDeliverable(data);
  if (transaction === 'DeliveryBooked') return createContentDeliveryBooked(data);
}

/**
 * @description Create message content for "OrderCreated" event/transaction
 */
const createContentOrderCreated = (data: Record<string, unknown>) => {
  const { name } = data;
  const subject = `Thanks for your order!`;
  const text = `Thanks for shopping with ACME Corp. Potted Plants, ${name}! Your order will now be grown and processed. When your plant is all perfect, our delivery partner will contact you to agree on a delivery time.`;
  const html = `<h1>Thanks for shopping with ACME Corp. Potted Plants, ${name}!</h1><p>Your order will now be grown and processed.<br><br>When your plant is all perfect, our delivery partner will contact you to agree on a delivery time.</p>`;

  return { subject, text, html };
};

/**
 * @description Create message content for "OrderDeliverable" event/transaction
 */
const createContentOrderDeliverable = (data: Record<string, unknown>) => {
  const { orderId, name, deliveryUrl } = data;
  const subject = `Your order is ready for delivery! (order ${orderId})`;
  const text = `It's a big day today, ${name}! Your order is ready for delivery. You'll need to pick a time and date, and then it's a done deal friend :) Book your delivery here at ${deliveryUrl}${orderId}`;
  const html = `<h1>It's a big day today, ${name}!</h1><p>Your order is ready for delivery. You'll need to pick a time and date, and then it's a done deal friend :)</p><br><br><a href="${deliveryUrl}${orderId}">Book your delivery here</a>`;

  return { subject, text, html };
};

/**
 * @description Create message content for "DeliveryBooked" event/transaction
 */
const createContentDeliveryBooked = (data: Record<string, unknown>) => {
  const { orderId, name, email, phone, street, city, time } = data;
  const subject = `Your delivery is booked! (order ${orderId})`;
  const text = `Hey ${name}, your delivery is booked! Sit back and relax and our delivery partner will show up at ${street}, ${city} at ${time}. In case they need to be in touch, they will contact you on your phone number ${phone} or email address ${email}.`;
  const html = `<h1>Hey ${name}, your delivery is booked!</h1><p>Sit back and relax and our delivery partner will show up at ${street}, ${city} at ${time}.<br><br>In case they need to be in touch, they will contact you on your phone number ${phone} or email address ${email}.</p>`;

  return { subject, text, html };
};
