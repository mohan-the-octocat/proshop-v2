import checkObjectId from '../middleware/checkObjectId.js';
import { isValidObjectId } from 'mongoose';

jest.mock('mongoose', () => ({
  isValidObjectId: jest.fn(),
}));

describe('checkObjectId', () => {
  it('should call next if the id is valid', () => {
    isValidObjectId.mockReturnValue(true);
    const req = {
      params: {
        id: 'valid_id',
      },
    };
    const res = {};
    const next = jest.fn();
    checkObjectId(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should throw an error if the id is invalid', () => {
    isValidObjectId.mockReturnValue(false);
    const req = {
      params: {
        id: 'invalid_id',
      },
    };
    const res = {
      status: jest.fn(),
    };
    const next = jest.fn();
    expect(() => checkObjectId(req, res, next)).toThrow(
      'Invalid ObjectId of:  invalid_id'
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });
});