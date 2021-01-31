import { orderResolvers } from './resolvers/order';
import { deliveryResolvers } from './resolvers/delivery';

export const resolvers = {
  Query: {
    ...orderResolvers.Query,
    ...deliveryResolvers.Query
  },
  Mutation: {
    ...orderResolvers.Mutation,
    ...deliveryResolvers.Mutation
  }
};
