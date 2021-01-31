import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

import { emitEvent } from '../../common/EmitEvent/EmitEvent';

/**
 * @description This is our integration point to handle anything to do with the stockist, like ordering items, stocking them, etc.
 */
export async function Stock(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult | void> {
  const eventBody = event.body ? JSON.parse(event.body) : event;
  const { orderId } = eventBody;

  if (orderId) {
    /**
     * Fast forward to items being stocked...
     */
    await emitEvent('StockCreated', { orderId });

    return {
      statusCode: 200,
      body: JSON.stringify(`Stock created for order ${orderId}`)
    } as APIGatewayProxyResult;
  }

  console.error('Missing "orderId" property!');

  return {
    statusCode: 400,
    body: JSON.stringify('Missing "orderId" property!')
  } as APIGatewayProxyResult;
}
