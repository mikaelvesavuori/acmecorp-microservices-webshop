import { makeNewOrderDatabase } from '../../entities/OrderDatabase';

import { emitEvent } from '../../../../common/EmitEvent/EmitEvent';

type Status = 'STOCKED' | 'DELIVERY_BOOKED';

export const updateOrderStatus = async (id: number, newStatus: Status) => {
  const db = makeNewOrderDatabase();
  const data = await db.updateOrderStatus(id, newStatus);

  if (newStatus === 'STOCKED') await emitEvent('OrderDeliverable', data);

  return data.orderId;
};
