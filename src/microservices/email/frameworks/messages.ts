import { createNodemailerData } from './nodemailer';
import { createContent } from './content';

/**
 * @description The URL to the application's delivery page plus question mark, ex. "https://myapp.com/delivery?"
 */
const DELIVERY_URL_BASE = process.env.DELIVERY_URL_BASE;

/**
 * @description Helper to create message for known transaction types
 */
export function createMessage(transaction: string, event: any) {
  if (transaction === 'OrderCreated') return createMessageOrderCreated(transaction, event);
  if (transaction === 'OrderDeliverable') return createMessageOrderDeliverable(transaction, event);
  if (transaction === 'DeliveryBooked') return createMessageDeliveryBooked(transaction, event);

  throw new Error('Unknown transaction type...');
}

/**
 * @description Create message for "OrderCreated" event/transaction
 */
const createMessageOrderCreated = (transaction: string, event: any) => {
  const { name, email } = event.body ? JSON.parse(event.body) : event;
  const { subject, text, html } = createContent(transaction, { name });
  return createNodemailerData(name, email, subject, text, html);
};

/**
 * @description Create message for "OrderDeliverable" event/transaction
 */
const createMessageOrderDeliverable = (transaction: string, event: any) => {
  const { orderId, name, email } = event.body ? JSON.parse(event.body) : event;
  const { subject, text, html } = createContent(transaction, {
    orderId,
    name,
    deliveryUrl: DELIVERY_URL_BASE
  });
  return createNodemailerData(name, email, subject, text, html);
};

/**
 * @description Create message for "DeliveryBooked" event/transaction
 */
const createMessageDeliveryBooked = (transaction: string, event: any) => {
  const { orderId, name, email, phone, street, city, time } = event.body
    ? JSON.parse(event.body)
    : event;

  const { subject, text, html } = createContent(transaction, {
    orderId,
    name,
    email,
    phone,
    street,
    city,
    time
  });

  return createNodemailerData(name, email, subject, text, html);
};
