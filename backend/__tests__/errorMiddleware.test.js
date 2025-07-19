import { notFound, errorHandler } from '../middleware/errorMiddleware.js';

describe('error middleware', () => {
  describe('notFound', () => {
    it('should create a 404 error and call next with it', () => {
      const req = {
        originalUrl: '/test',
      };
      const res = {
        status: jest.fn(),
      };
      const next = jest.fn();
      notFound(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).toHaveBeenCalledWith(new Error('Not Found - /test'));
    });
  });

  describe('errorHandler', () => {
    it('should send a 500 error if the status code is 200', () => {
      const err = new Error('test error');
      const req = {};
      const res = {
        statusCode: 200,
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'test error',
        stack: expect.any(String),
      });
    });

    it('should send the correct status code and message', () => {
      const err = new Error('test error');
      const req = {};
      const res = {
        statusCode: 400,
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'test error',
        stack: expect.any(String),
      });
    });

    it('should not include the stack in production', () => {
      process.env.NODE_ENV = 'production';
      const err = new Error('test error');
      const req = {};
      const res = {
        statusCode: 500,
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      errorHandler(err, req, res, next);
      expect(res.json).toHaveBeenCalledWith({
        message: 'test error',
        stack: null,
      });
      process.env.NODE_ENV = 'test';
    });
  });
});