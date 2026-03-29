import jwt, { SignOptions } from 'jsonwebtoken';
import { isPlainObject } from 'lodash';

import { InvalidTokenError } from 'errors';

export const signToken = (payload: object, options?: SignOptions): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '180 days',
    ...options,
  });
};

export const verifyToken = (token: string): { [key: string]: any } => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (isPlainObject(payload)) {
      return payload as { [key: string]: any };
    }
    throw new Error();
  } catch (error) {
    throw new InvalidTokenError();
  }
};
