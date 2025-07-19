import { calcPrices } from '../utils/calcPrices.js';

describe('calcPrices', () => {
  it('should return an object with itemsPrice, shippingPrice, taxPrice, and totalPrice', () => {
    const orderItems = [
      { price: 10, qty: 1 },
      { price: 20, qty: 2 },
    ];
    const prices = calcPrices(orderItems);
    expect(prices).toHaveProperty('itemsPrice');
    expect(prices).toHaveProperty('shippingPrice');
    expect(prices).toHaveProperty('taxPrice');
    expect(prices).toHaveProperty('totalPrice');
  });

  it('should calculate the itemsPrice correctly', () => {
    const orderItems = [
      { price: 10, qty: 1 },
      { price: 20, qty: 2 },
    ];
    const { itemsPrice } = calcPrices(orderItems);
    expect(itemsPrice).toBe('50.00');
  });

  it('should calculate the shippingPrice correctly', () => {
    const orderItems = [{ price: 10, qty: 1 }];
    const { shippingPrice } = calcPrices(orderItems);
    expect(shippingPrice).toBe('10.00');
  });

  it('should set shippingPrice to 0 if itemsPrice is greater than 100', () => {
    const orderItems = [{ price: 110, qty: 1 }];
    const { shippingPrice } = calcPrices(orderItems);
    expect(shippingPrice).toBe('0.00');
  });

  it('should calculate the taxPrice correctly', () => {
    const orderItems = [{ price: 10, qty: 1 }];
    const { taxPrice } = calcPrices(orderItems);
    expect(taxPrice).toBe('1.50');
  });

  it('should calculate the totalPrice correctly', () => {
    const orderItems = [{ price: 10, qty: 1 }];
    const { totalPrice } = calcPrices(orderItems);
    expect(totalPrice).toBe('21.50');
  });
});