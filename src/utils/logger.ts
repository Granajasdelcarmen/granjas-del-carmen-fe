/**
 * Centralized logging utility for the frontend
 * Provides structured logging with different levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private static isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log debug message (only in development)
   */
  static debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Log info message
   */
  static info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '');
    }
  }

  /**
   * Log warning message
   */
  static warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || '');
  }

  /**
   * Log error message
   */
  static error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      timestamp: new Date().toISOString(),
    };

    if (error instanceof Error) {
      errorContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      errorContext.error = error;
    }

    console.error(`[ERROR] ${message}`, errorContext);

    // In production, you could send this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorContext });
  }

  /**
   * Log API error with request details
   */
  static apiError(
    endpoint: string,
    method: string,
    error: Error | unknown,
    context?: LogContext
  ): void {
    this.error(
      `API Error: ${method} ${endpoint}`,
      error,
      {
        ...context,
        endpoint,
        method,
      }
    );
  }
}

export const logger = Logger;
export default logger;

