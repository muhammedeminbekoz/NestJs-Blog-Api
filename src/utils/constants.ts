export const jwtConstants = {
  secret: process.env.JWT_SERCRET_KEY,
  IS_PUBLIC_KEY: 'isPublic',
  expiresIn: process.env.JWT_EXPIRES_IN,
};

export const DEFAULT_PAGE_SIZE: number = 10;
