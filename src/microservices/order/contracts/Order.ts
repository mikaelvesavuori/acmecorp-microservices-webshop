import { Currency } from './Currency';
import { OrderDto } from './OrderDto';

export interface Order {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  customerType: string;
  market: string;
  products: string;
  totalPrice: number;
  localPrice: number;
  testId?: null | number;
  convertPricesToLocal: (newCurrency: Currency) => void;
  getLocalPrice: () => number;
  getRequiredOrderPlacementData: () => OrderDto;
}

export interface OrderB2B extends Order {
  verifyOrganizationNumber: () => boolean;
}

export interface OrderB2C extends Order {}
