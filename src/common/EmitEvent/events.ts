const EVENTBUS_NAME = 'microservicesdemo';

/**
 * @description Valid events (and examples).
 * This approach of consolidating "valid events" is only really feasible in a small-scale, controlled setting. See it as a convenience!
 * Expect schemas to be stored (only) in Eventbridge or someplace else, in a real setting.
 */
export const events = {
  /**
   * Order has been validated and created as an entity.
   * Runs in Payment service (if B2C: after Payment Provider purchase complete)
   */
  OrderCreated: (data: Record<string, unknown>) => ({
    EventBusName: EVENTBUS_NAME,
    Source: 'microservicesdemo.order',
    DetailType: 'OrderCreated',
    Detail: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      street: data.street,
      city: data.city,
      customerType: data.customerType,
      market: data.market,
      products: data.products,
      totalPrice: data.totalPrice,
      orgNumber: data.orgNumber,
      testId: data.testId
    })
  }),
  /**
   * Order placed successfully in the Database.
   */
  OrderPlaced: (data: Record<string, unknown>) => ({
    EventBusName: EVENTBUS_NAME,
    Source: 'microservicesdemo.order',
    DetailType: 'OrderPlaced',
    Detail: JSON.stringify({
      orderId: data.orderId,
      products: data.products,
      name: data.name,
      email: data.email,
      totalPrice: data.totalPrice
    })
  }),
  /**
   * Ordered item has been stocked
   */
  StockCreated: (data: Record<string, unknown>) => ({
    EventBusName: EVENTBUS_NAME,
    Source: 'microservicesdemo.stock',
    DetailType: 'StockCreated',
    Detail: JSON.stringify({
      orderId: data.orderId
    })
  }),
  /**
   * Order ready for delivery
   */
  OrderDeliverable: (data: Record<string, unknown>) => ({
    EventBusName: EVENTBUS_NAME,
    Source: 'microservicesdemo.order',
    DetailType: 'OrderDeliverable',
    Detail: JSON.stringify({
      orderId: data.orderId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      street: data.street,
      city: data.city
    })
  }),
  /**
   * Delivery is booked
   */
  DeliveryBooked: (data: any) => ({
    EventBusName: EVENTBUS_NAME,
    Source: 'microservicesdemo.delivery',
    DetailType: 'DeliveryBooked',
    Detail: JSON.stringify({
      orderId: data.orderId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      street: data.street,
      city: data.city,
      deliveryTime: data.deliveryTime
    })
  })
};
