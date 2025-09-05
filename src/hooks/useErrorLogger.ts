import { useCallback } from 'react';
import { errorLogger, ErrorType, ErrorSeverity } from '@/utils/errorLogger';

export const useErrorLogger = () => {
  const logError = useCallback(async (
    operation: string,
    error: Error | string,
    errorType: ErrorType,
    options?: {
      severity?: ErrorSeverity;
      fileInfo?: {
        name?: string;
        size?: number;
        type?: string;
        path?: string;
      };
      context?: Record<string, any>;
    }
  ) => {
    await errorLogger.logError({
      operation,
      error,
      errorType,
      severity: options?.severity,
      fileInfo: options?.fileInfo,
      context: options?.context
    });
  }, []);

  const logUploadError = useCallback(async (
    operation: string,
    error: Error | string,
    fileInfo?: {
      name?: string;
      size?: number;
      type?: string;
      path?: string;
    }
  ) => {
    await errorLogger.logUploadError(operation, error, fileInfo);
  }, []);

  const logProcessingError = useCallback(async (
    operation: string,
    error: Error | string,
    context?: Record<string, any>
  ) => {
    await errorLogger.logProcessingError(operation, error, context);
  }, []);

  const logAiError = useCallback(async (
    operation: string,
    error: Error | string,
    context?: Record<string, any>
  ) => {
    await errorLogger.logAiError(operation, error, context);
  }, []);

  const logSystemError = useCallback(async (
    operation: string,
    error: Error | string,
    context?: Record<string, any>
  ) => {
    await errorLogger.logSystemError(operation, error, context);
  }, []);

  const logNetworkError = useCallback(async (
    operation: string,
    error: Error | string,
    context?: Record<string, any>
  ) => {
    await errorLogger.logNetworkError(operation, error, context);
  }, []);

  return {
    logError,
    logUploadError,
    logProcessingError,
    logAiError,
    logSystemError,
    logNetworkError
  };
};