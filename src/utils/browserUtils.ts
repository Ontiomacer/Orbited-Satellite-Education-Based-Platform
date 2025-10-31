/**
 * Browser utilities for handling common browser extension issues
 */

/**
 * Suppress common browser extension errors that don't affect app functionality
 */
export const suppressBrowserExtensionErrors = () => {
  // Suppress the common "message port closed" error from browser extensions
  const originalError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Filter out common browser extension errors
    const extensionErrors = [
      'The message port closed before a response was received',
      'Extension context invalidated',
      'Could not establish connection',
      'chrome-extension://',
      'moz-extension://',
    ];
    
    const isExtensionError = extensionErrors.some(error => 
      message.includes(error)
    );
    
    if (!isExtensionError) {
      originalError.apply(console, args);
    }
  };
};

/**
 * Check if the app is running in a development environment
 */
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

/**
 * Check if the app is running in production
 */
export const isProduction = () => {
  return import.meta.env.PROD;
};

/**
 * Get the current environment name
 */
export const getEnvironment = () => {
  return import.meta.env.MODE;
};

/**
 * Log application startup information
 */
export const logAppStartup = () => {
  if (isDevelopment()) {
    console.log('🛰️ Orbited Satellite Education Platform - Development Mode');
    console.log('Environment:', getEnvironment());
    console.log('Vite Version:', import.meta.env.VITE_APP_VERSION || 'Unknown');
  }
};

/**
 * Handle unhandled promise rejections gracefully
 */
export const setupGlobalErrorHandling = () => {
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Check if it's a browser extension error
    if (error && typeof error === 'object' && error.message) {
      const extensionErrors = [
        'The message port closed before a response was received',
        'Extension context invalidated',
      ];
      
      const isExtensionError = extensionErrors.some(errMsg => 
        error.message.includes(errMsg)
      );
      
      if (isExtensionError) {
        // Prevent the error from being logged
        event.preventDefault();
        return;
      }
    }
    
    // Log other errors normally
    console.error('Unhandled promise rejection:', error);
  });
};

export default {
  suppressBrowserExtensionErrors,
  isDevelopment,
  isProduction,
  getEnvironment,
  logAppStartup,
  setupGlobalErrorHandling,
};