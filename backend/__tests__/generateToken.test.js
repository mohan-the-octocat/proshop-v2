import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

describe('generateToken', () => {
  it('should generate a token and set it as a cookie', () => {
    const res = {
      cookie: jest.fn(),
    };
    const userId = '123';
    generateToken(res, userId);
    expect(res.cookie).toHaveBeenCalled();
    const [cookieName, token, options] = res.cookie.mock.calls[0];
    expect(cookieName).toBe('jwt');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe(userId);
    expect(options.httpOnly).toBe(true);
    expect(options.secure).toBe(process.env.NODE_ENV !== 'development');
    expect(options.sameSite).toBe('strict');
    expect(options.maxAge).toBe(30 * 24 * 60 * 60 * 1000);
  });
});