// Set required environment variables before any test module is loaded
process.env.JWT_SECRET = 'test-secret-for-jest';
process.env.NODE_ENV = 'test';
