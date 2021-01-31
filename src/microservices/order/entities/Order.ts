import { OrderDto } from '../contracts/OrderDto';
import { Currency } from '../contracts/Currency';

/**
 * @description Factory to create order
 */
export const makeNewOrder = (orderData: OrderDto): OrderB2B | OrderB2C => {
  try {
    if (orderData.customerType.toUpperCase() === 'B2B') return new OrderB2B(orderData);
    if (orderData.customerType.toUpperCase() === 'B2C') return new OrderB2C(orderData);
    throw new Error('Unknown customer type!');
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @description Order entity that handles any interactions with the order during creation and placement.
 */
class Order {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  customerType: string;
  market: string;
  products: string;
  totalPrice: number; // Always in USD
  localPrice: number;
  testId: number;
  orgNumber: number;

  constructor(orderData: OrderDto) {
    this.name = orderData.name;
    this.email = orderData.email;
    this.phone = orderData.phone;
    this.street = orderData.street;
    this.city = orderData.city;
    this.customerType = orderData.customerType;
    this.market = orderData.market;
    this.products = orderData.products;
    this.totalPrice = orderData.totalPrice;
    this.localPrice = this.convertPricesToLocal('USD');
    this.orgNumber = orderData.orgNumber || 0;
    this.testId = orderData.testId || 0;

    this.validateOrderData();
  }

  private validateOrderData() {
    if (
      (this.customerType === 'B2B' && !this.orgNumber) ||
      (this.customerType === 'B2B' && this.orgNumber === 0)
    )
      throw new Error('B2B customer is missing organization number!');
    if (this.customerType !== 'B2B' && this.customerType !== 'B2C')
      throw new Error(`Unsupported customer type, "${this.customerType}"!`);
    if (this.market !== 'MX' && this.market !== 'US')
      throw new Error(`Unsupported market, "${this.market}"!`);
  }

  /**
   * Prices are always set in USD from start. If you need to convert to a local market currency, do it here.
   */
  public convertPricesToLocal(newCurrency: Currency): number {
    let conversionFactor = 1;

    if (newCurrency.toUpperCase() === 'MXN') conversionFactor = 20;
    else if (newCurrency.toUpperCase() === 'USD') conversionFactor = 1;
    else throw new Error('Unsupported currency!');

    const updatedLocalPrice = this.calculateLocalPrice(conversionFactor);
    this.setLocalPrice(updatedLocalPrice);

    return updatedLocalPrice;
  }

  private calculateLocalPrice(conversionFactor: number) {
    return (this.totalPrice / 100) * conversionFactor;
  }

  private setLocalPrice(updatedLocalPrice: number): void {
    this.localPrice = updatedLocalPrice;
  }

  public getLocalPrice(): number {
    return this.localPrice;
  }

  public getRequiredOrderPlacementData(): OrderDto {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      street: this.street,
      city: this.city,
      customerType: this.customerType,
      market: this.market,
      products: this.products,
      totalPrice: this.totalPrice,
      orgNumber: this.orgNumber,
      testId: this.testId
    };
  }
}

class OrderB2B extends Order {
  /**
   * For B2B customers, verify that they have valid, trusted org numbers (must be 6-20 characters)
   */
  public verifyOrganizationNumber(): boolean {
    console.log('Org number', this.orgNumber);
    const orgNumberLength = this.orgNumber.toString().length;
    const valid = orgNumberLength && orgNumberLength >= 6 && orgNumberLength <= 20;

    if (!valid) {
      console.error('Organization number is invalid!');
      throw new Error('Organization number is invalid!');
    }

    return valid;
  }
}

class OrderB2C extends Order {}
