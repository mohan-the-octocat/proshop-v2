import asyncHandler from '../middleware/asyncHandler.js';

describe('asyncHandler', () => {
  it('should call the wrapped function with the correct arguments', () => {
    const fn = jest.fn();
    const req = {};
    const res = {};
    const next = () => {};
    asyncHandler(fn)(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it('should call next with the error if the wrapped function rejects', async () => {
    const error = new Error('test error');
    const fn = jest.fn().mockRejectedValue(error);
    const req = {};
    const res = {};
    const next = jest.fn();
    await asyncHandler(fn)(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});