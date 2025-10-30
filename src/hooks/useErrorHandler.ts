import { useCallback } from 'react';

interface ErrorHandlerOptions {
  onError?: (error: Error) => void;
  fallback?: any;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const handleError = useCallback((error: unknown, context?: string) => {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // Sanitize context to prevent log injection
    const sanitizedContext = context ? context.replace(/[\r\n\t]/g, ' ').substring(0, 100) : '';
    
    // Log error with sanitized context
    console.error(`Error${sanitizedContext ? ` in ${sanitizedContext}` : ''}:`, errorObj.message);
    
    // Call custom error handler if provided
    if (options.onError) {
      try {
        options.onError(errorObj);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    }
    
    return options.fallback;
  }, [options.onError, options.fallback]);

  const safeExecute = useCallback(async <T>(
    fn: () => T | Promise<T>,
    context?: string
  ): Promise<T | undefined> => {
    try {
      return await fn();
    } catch (error) {
      return handleError(error, context);
    }
  }, [handleError]);

  return { handleError, safeExecute };
};