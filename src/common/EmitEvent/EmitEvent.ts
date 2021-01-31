import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
const eventBridge = new EventBridgeClient({ region: 'eu-north-1' });

import { events } from './events';

/**
 * @description Utility to emit events with AWS EventBridge library
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html
 * @see https://www.npmjs.com/package/@aws-sdk/client-eventbridge
 */
export async function emitEvent(eventName: string, data: Record<string, unknown>) {
  try {
    const command = events[eventName](data);
    const event = new PutEventsCommand({ Entries: [command] });
    if (!event) throw new Error('No such event name!');

    return await eventBridge.send(event);
  } catch (error) {
    console.error('Failed to emit event!\n', error);
  }
}
