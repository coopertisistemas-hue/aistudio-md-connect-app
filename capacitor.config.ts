import type { CapacitorConfig } from '@capacitor/cli';

/**
 * MD Connect App - Capacitor Configuration
 * 
 * App Metadata:
 * - App ID: com.mdconnect.app (reverse domain notation)
 * - App Name: MD Connect
 * - Short Name: MD Connect
 * - Version: 1.0.0
 * - Description: Momento Devocional - Palavra, Comunidade e Apoio
 * 
 * Platform Support:
 * - Android: Primary platform (API 22+)
 * - iOS: Planned for Phase 2
 */
const config: CapacitorConfig = {
  // App Identification
  appId: 'com.mdconnect.app',
  appName: 'MD Connect',
  
  // Build Configuration
  webDir: 'dist',
  
  // Server Configuration
  server: {
    androidScheme: 'https',
    cleartext: false,
    // Allow cleartext only in development for local debugging
    ...(process.env.NODE_ENV === 'development' && { cleartext: true }),
  },
  
  // Plugin Configuration
  plugins: {
    // Splash Screen Configuration
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1e3a8a', // IPDA Blue
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    // Status Bar Configuration
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1e3a8a',
    },
    // App Plugin (lifecycle events)
    App: {
      // Handle app state changes
    },
  },
  
  // Android-specific Configuration
  android: {
    // Security
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: process.env.NODE_ENV === 'development',
    
    // Override user agent for analytics
    overrideUserAgent: 'MD-Connect-Android/1.0.0',
    
    // Background color during WebView load
    backgroundColor: '#1e3a8a',
  },
  
  // iOS-specific Configuration (for Phase 2)
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#1e3a8a',
  },
};

export default config;
