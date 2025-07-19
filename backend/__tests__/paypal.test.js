import { checkIfNewTransaction, verifyPayPalPayment } from '../utils/paypal.js';

describe('paypal utils', () => {
  describe('checkIfNewTransaction', () => {
    it('should return true if no orders with the given transaction ID are found', async () => {
      const orderModel = {
        find: jest.fn().mockResolvedValue([]),
      };
      const paypalTransactionId = '123';
      const isNewTransaction = await checkIfNewTransaction(
        orderModel,
        paypalTransactionId
      );
      expect(isNewTransaction).toBe(true);
    });

    it('should return false if orders with the given transaction ID are found', async () => {
      const orderModel = {
        find: jest.fn().mockResolvedValue([{}, {}]),
      };
      const paypalTransactionId = '123';
      const isNewTransaction = await checkIfNewTransaction(
        orderModel,
        paypalTransactionId
      );
      expect(isNewTransaction).toBe(false);
    });
  });

  describe('verifyPayPalPayment', () => {
    it('should return verified as true and the correct value if the payment is completed', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test_token' }),
      }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'COMPLETED', purchase_units: [{ amount: { value: '100.00' } }] }),
      });

      const paypalTransactionId = '123';
      const { verified, value } = await verifyPayPalPayment(paypalTransactionId);
      expect(verified).toBe(true);
      expect(value).toBe('100.00');
    });

    it('should return verified as false if the payment is not completed', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test_token' }),
      }).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'PENDING', purchase_units: [{ amount: { value: '100.00' } }] }),
      });

      const paypalTransactionId = '123';
      const { verified } = await verifyPayPalPayment(paypalTransactionId);
      expect(verified).toBe(false);
    });

    it('should throw an error if the access token request fails', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
      });

      const paypalTransactionId = '123';
      await expect(verifyPayPalPayment(paypalTransactionId)).rejects.toThrow(
        'Failed to get access token'
      );
    });

    it('should throw an error if the payment verification request fails', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test_token' }),
      }).mockResolvedValueOnce({
        ok: false,
      });

      const paypalTransactionId = '123';
      await expect(verifyPayPalPayment(paypalTransactionId)).rejects.toThrow(
        'Failed to verify payment'
      );
    });
  });
});