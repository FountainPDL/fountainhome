import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fountain.home',
  appName: 'FountainHome',
  webDir: '.next/standalone',
  bundledWebRuntime: false,
  server: {
    url: 'http://localhost:3000',
    cleartext: true
  }
};

export default config;
