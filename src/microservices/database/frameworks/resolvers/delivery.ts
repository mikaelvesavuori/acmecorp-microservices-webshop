import { addDeliveryDataToOrder } from '../mutations/addDeliveryDataToOrder';

export const deliveryResolvers = {
  Query: {},
  Mutation: {
    addDeliveryDataToOrder: async (obj, args: any) => {
      const { orderId, deliveryTime } = args.deliveryData;

      await addDeliveryDataToOrder(orderId, deliveryTime);
      return 'OK';
    }
  }
};
