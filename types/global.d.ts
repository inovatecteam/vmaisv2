// Global type declarations for the project

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// This ensures that the 'google' type is recognized globally
declare const google: typeof window.google;

// This is required to make this file a module
export {};