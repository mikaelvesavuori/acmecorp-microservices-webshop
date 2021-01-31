import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import fetch from 'node-fetch';

import { emitEvent } from '../../common/EmitEvent/EmitEvent';

const DATABASE_API_ENDPOINT = process.env.DATABASE_API_ENDPOINT;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

/**
 * @description This is a canned mock of what a delivery provider might send back when you request to book a delivery timeslot.
 */
export async function BookDelivery(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult | void> {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      body: JSON.stringify('OK')
    } as APIGatewayProxyResult;
  }

  const eventBody = event.body ? JSON.parse(event.body) : event;
  const { orderId, deliveryTime } = eventBody;

  if (!orderId || !deliveryTime) {
    console.error('Missing orderId or deliveryTime!');
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      body: JSON.stringify('Missing required parameters!')
    } as APIGatewayProxyResult;
  }

  /**
   * In a real scenario, you would want to integrate and send the delivery info to your Delivery Provider.
   *
   * In this demo, however, we will want to fetch some additional data from the database, which the email service will need to know about.
   * Between putting such fetching logic in this service (Delivery) or in the Email service, I'd rather put it in Delivery, as it's
   * more of a "core" service than the Email service is, and such logic can be considered "privileged". An Email service should not have
   * any such privileges.
   */
  const data = await fetch(DATABASE_API_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      query: `query {
        getOrder(id: ${orderId}) {
          customerName
          customerEmail
          customerPhone
          customerStreet
          customerCity
        }
      }`
    })
  })
    .then((res) => res.json())
    .then((res) => res.data.getOrder)
    .catch((error) => console.error(error));

  if (!data) throw new Error('No data received!');

  /**
   * Add delivery information to order
   */
  await fetch(DATABASE_API_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      query: `mutation {
        addDeliveryDataToOrder(deliveryData: {orderId: ${orderId}, deliveryTime: "${deliveryTime}"})
      }`
    })
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.data.addDeliveryDataToOrder) {
        const message = 'Failed to update with delivery information!';
        console.error(message);
        throw new Error(message);
      }
    })
    .catch((error) => console.error(error));

  // @ts-ignore
  const { customerName, customerEmail, customerPhone, customerStreet, customerCity } = data;

  /**
   * Create a booking object
   */
  const booking = {
    orderId,
    name: customerName,
    email: customerEmail,
    phone: customerPhone,
    street: customerStreet,
    city: customerCity,
    deliveryTime
  };

  /**
   * Emit event so our other services can use the information
   */
  await emitEvent('DeliveryBooked', booking);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'OPTIONS,POST'
    },
    body: JSON.stringify(booking)
  } as APIGatewayProxyResult;
}
