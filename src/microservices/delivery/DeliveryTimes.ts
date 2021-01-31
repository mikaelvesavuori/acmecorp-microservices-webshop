import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

/**
 * @description This is a canned mock of what a delivery provider might send back when you request available timeslots.
 */
export async function DeliveryTimes(
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
        'Access-Control-Allow-Methods': 'OPTIONS,GET'
      },
      body: JSON.stringify('OK')
    } as APIGatewayProxyResult;
  }

  /**
   * Send back the following hard-coded dates:
   * 02/15/2021 @ 5:00pm (UTC) ---> 1613408400000
   * 02/16/2021 @ 6:00pm (UTC) ---> 1613498400000
   * 02/17/2021 @ 7:00pm (UTC) ---> 1613588400000
   */

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'OPTIONS,GET'
    },
    body: JSON.stringify({
      deliveryOptions: ['1613408400000', '1613498400000', '1613588400000']
    })
  } as APIGatewayProxyResult;
}
