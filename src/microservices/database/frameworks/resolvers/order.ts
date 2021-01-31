import { getOrder } from '../queries/getOrder';
import { getAllTestOrders } from '../queries/getAllTestOrders';

import { placeOrder } from '../mutations/placeOrder';
import { updateOrderStatus } from '../mutations/updateOrderStatus';

export const orderResolvers = {
  Query: {
    getOrder: async (obj, args: any) => {
      if (!args || !args.id) throw new Error('No ID provided!');
      const id = args.id;
      const data = await getOrder(id);
      return { ...data };
    },
    getAllTestOrders: async (obj, args: any) => {
      if (!args || !args.testId) throw new Error('No test ID provided!');
      const testId = args.testId;
      return await getAllTestOrders(testId);
    },
    getOrderLegacy: () => 'Something from the old legacy resolver'
  },
  Mutation: {
    placeOrder: async (obj, args: any) => {
      if (!args) throw new Error('No products provided!');
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
        orgNumber,
        testId
      } = args;

      const data = await placeOrder(
        name,
        email,
        phone,
        street,
        city,
        customerType,
        market,
        products,
        totalPrice,
        orgNumber,
        testId
      );
      return {
        orderId: data
      };
    },
    updateOrderStatus: async (obj, args: any) => {
      if (!args || !args.id || !args.status) throw new Error('No ID and/or status provided!');
      const { id, status } = args;
      const data = await updateOrderStatus(id, status);
      return {
        orderId: data
      };
    }
  }
};
