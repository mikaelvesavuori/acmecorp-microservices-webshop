import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

import fetch from 'node-fetch';

const ENDPOINT = process.env.DATABASE_API_ENDPOINT;

/**
 * @description Placing the order is done after any payment processing is complete.
 * The function is nothing more than a (public) security buffer that interacts with the ("internal") Database API.
 */
export async function PlaceOrder(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult | void> {
  try {
    const eventBody = event.body ? JSON.parse(event.body) : event;
    console.log('eventBody', eventBody);

    /**
     * Use eventbody.detail if you are not doing any input transformation.
     * Since we are using 11 arguments, we are above the maximum number of items we can transform.
     * Therefore, we accept all data and destructure it manually instead.
     */
    const {
      name,
      email,
      phone,
      street,
      city,
      customerType,
      market,
      products,
      totalPrice,
      testId,
      orgNumber
    } = eventBody.detail;

    const body = {
      query: `mutation {
      placeOrder(name: "${name}", email: "${email}", phone: "${phone}", street: "${street}", city: "${city}", customerType: "${customerType}", market: "${market}", products: "${products}", totalPrice: ${totalPrice}, testId: ${testId}, orgNumber: ${orgNumber}) {
        orderId
      }
    }
    `
    };

    await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return {
      statusCode: 200,
      body: JSON.stringify('SUCCESS')
    } as APIGatewayProxyResult;
  } catch (error) {
    console.error(error);

    return {
      statusCode: 400,
      body: JSON.stringify(error)
    } as APIGatewayProxyResult;
  }
}
