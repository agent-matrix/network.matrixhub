/**
 * Monitoring and Analytics utilities for production
 * Integrate with services like Sentry, DataDog, New Relic, etc.
 */

interface ErrorContext {
  user?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Initialize monitoring services
 * Call this in your root layout or _app file
 */
export function initMonitoring() {
  if (typeof window === 'undefined') return;

  // Initialize Sentry (example)
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log('Sentry monitoring initialized');
    // Example: Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
  }

  // Initialize Google Analytics (example)
  if (process.env.NEXT_PUBLIC_GA_ID) {
    console.log('Google Analytics initialized');
    // Example: gtag('config', process.env.NEXT_PUBLIC_GA_ID);
  }

  // Log deployment info
  console.log('App initialized:', {
    env: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  });
}

/**
 * Track page views
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
}

/**
 * Track custom events
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Event:', eventName, properties);
  }
}

/**
 * Log errors to monitoring service
 */
export function logError(
  error: Error,
  context?: ErrorContext
) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, context);
  }

  // Send to Sentry or other error tracking service
  // Example: Sentry.captureException(error, { ...context });

  // Track in analytics
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    ...context?.tags,
  });
}

/**
 * Performance monitoring
 */
export function trackPerformance(metric: string, value: number) {
  if (typeof window === 'undefined') return;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Performance: ${metric} = ${value}ms`);
  }

  // Send to analytics
  trackEvent('performance', {
    metric,
    value,
  });
}

/**
 * Web Vitals reporting
 */
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric.name, metric.value);
  }

  // Send to analytics
  trackEvent('web_vitals', {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    label: metric.label,
  });
}

// Type definitions for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
