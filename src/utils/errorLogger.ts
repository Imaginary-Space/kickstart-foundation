import { supabase } from '@/integrations/supabase/client';

export type ErrorType = 
  | 'upload_error' 
  | 'processing_error' 
  | 'ai_error' 
  | 'system_error' 
  | 'auth_error' 
  | 'network_error';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorLogData {
  operation: string;
  error: Error | string;
  errorType: ErrorType;
  severity?: ErrorSeverity;
  fileInfo?: {
    name?: string;
    size?: number;
    type?: string;
    path?: string;
  };
  context?: Record<string, any>;
}

class ErrorLogger {
  private getUserAgent(): string {
    return typeof window !== 'undefined' ? navigator.userAgent : 'Unknown';
  }

  private getCurrentUrl(): string {
    return typeof window !== 'undefined' ? window.location.href : '';
  }

  private async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    } catch {
      return null;
    }
  }

  private sanitizeError(error: Error | string): { message: string; details: Record<string, any> } {
    if (typeof error === 'string') {
      return { message: error, details: {} };
    }

    const details: Record<string, any> = {
      name: error.name,
      stack: error.stack,
    };

    // Add additional error properties if available
    if ('cause' in error) details.cause = error.cause;
    if ('code' in error) details.code = (error as any).code;

    return { 
      message: error.message || 'Unknown error', 
      details 
    };
  }

  async logError({
    operation,
    error,
    errorType,
    severity = 'medium',
    fileInfo,
    context
  }: ErrorLogData): Promise<void> {
    try {
      const userId = await getCurrentUserId();
      const { message, details } = this.sanitizeError(error);
      
      const errorData = {
        user_id: userId,
        error_type: errorType,
        operation,
        error_message: message,
        error_details: {
          ...details,
          context: context || {},
          timestamp: new Date().toISOString(),
        },
        file_info: fileInfo || {},
        user_agent: this.getUserAgent(),
        url: this.getCurrentUrl(),
        severity,
      };

      // Try to log to database first
      const { error: dbError } = await supabase
        .from('error_logs')
        .insert(errorData);

      if (dbError) {
        // If database logging fails, try edge function as fallback
        console.warn('Database error logging failed, trying edge function:', dbError);
        await this.logViaEdgeFunction(errorData);
      }
    } catch (fallbackError) {
      // Final fallback: log to console
      console.error('Error logging completely failed:', fallbackError);
      console.error('Original error that failed to log:', error);
    }
  }

  private async logViaEdgeFunction(errorData: any): Promise<void> {
    try {
      await supabase.functions.invoke('log-error', {
        body: errorData
      });
    } catch (edgeError) {
      console.error('Edge function error logging failed:', edgeError);
      throw edgeError;
    }
  }

  // Convenience methods for different error types
  async logUploadError(operation: string, error: Error | string, fileInfo?: ErrorLogData['fileInfo']): Promise<void> {
    return this.logError({
      operation,
      error,
      errorType: 'upload_error',
      severity: 'high',
      fileInfo
    });
  }

  async logProcessingError(operation: string, error: Error | string, context?: Record<string, any>): Promise<void> {
    return this.logError({
      operation,
      error,
      errorType: 'processing_error',
      severity: 'medium',
      context
    });
  }

  async logAiError(operation: string, error: Error | string, context?: Record<string, any>): Promise<void> {
    return this.logError({
      operation,
      error,
      errorType: 'ai_error',
      severity: 'high',
      context
    });
  }

  async logSystemError(operation: string, error: Error | string, context?: Record<string, any>): Promise<void> {
    return this.logError({
      operation,
      error,
      errorType: 'system_error',
      severity: 'critical',
      context
    });
  }

  async logNetworkError(operation: string, error: Error | string, context?: Record<string, any>): Promise<void> {
    return this.logError({
      operation,
      error,
      errorType: 'network_error',
      severity: 'medium',
      context
    });
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Helper function to get current user ID
async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}