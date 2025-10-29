import { handleApiError, createApiError } from '../../utils/errorHandler';

describe('errorHandler utils', () => {
  describe('handleApiError', () => {
    it('should handle error with response data message', () => {
      const error = {
        response: {
          data: {
            message: 'Custom error message',
          },
        },
      };
      expect(handleApiError(error)).toBe('Custom error message');
    });

    it('should handle error with direct message', () => {
      const error = {
        message: 'Direct error message',
      };
      expect(handleApiError(error)).toBe('Direct error message');
    });

    it('should handle HTTP status codes', () => {
      const error400 = { response: { status: 400 } };
      expect(handleApiError(error400)).toBe('Invalid request. Please check your input.');

      const error401 = { response: { status: 401 } };
      expect(handleApiError(error401)).toBe('Authentication failed. Please log in again.');

      const error403 = { response: { status: 403 } };
      expect(handleApiError(error403)).toBe('Access denied. You do not have permission.');

      const error404 = { response: { status: 404 } };
      expect(handleApiError(error404)).toBe('Resource not found.');

      const error429 = { response: { status: 429 } };
      expect(handleApiError(error429)).toBe('Too many requests. Please try again later.');

      const error500 = { response: { status: 500 } };
      expect(handleApiError(error500)).toBe('Server error. Please try again later.');

      const error999 = { response: { status: 999 } };
      expect(handleApiError(error999)).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle network errors', () => {
      const networkError = {};
      expect(handleApiError(networkError)).toBe('Network error. Please check your connection and try again.');
    });
  });

  describe('createApiError', () => {
    it('should create API error with message only', () => {
      const error = createApiError('Test error');
      expect(error).toEqual({
        message: 'Test error',
      });
    });

    it('should create API error with message and code', () => {
      const error = createApiError('Test error', 'TEST_CODE');
      expect(error).toEqual({
        message: 'Test error',
        code: 'TEST_CODE',
      });
    });

    it('should create API error with numeric code', () => {
      const error = createApiError('Test error', 400);
      expect(error).toEqual({
        message: 'Test error',
        code: 400,
      });
    });
  });
});