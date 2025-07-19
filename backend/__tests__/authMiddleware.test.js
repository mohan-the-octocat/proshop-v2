import { protect, admin } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

describe('auth middleware', () => {
  describe('protect', () => {
    it('should call next if the user is authenticated', async () => {
      const req = {
        cookies: {
          jwt: jwt.sign({ userId: '123' }, process.env.JWT_SECRET),
        },
      };
      const res = {};
      const next = jest.fn();
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: '123' }),
      });
      await protect(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should call next with an error if there is no token', async () => {
      const req = {
        cookies: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      await protect(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).toHaveBeenCalledWith(new Error('Not authorized, no token'));
    });

    it('should call next with an error if the token is invalid', async () => {
      const req = {
        cookies: {
          jwt: 'invalid_token',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      await protect(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('admin', () => {
    it('should call next if the user is an admin', () => {
      const req = {
        user: {
          isAdmin: true,
        },
      };
      const res = {};
      const next = jest.fn();
      admin(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should return a 401 error if the user is not an admin', () => {
      const req = {
        user: {
          isAdmin: false,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      expect(() => admin(req, res, next)).toThrow('Not authorized as an admin');
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});