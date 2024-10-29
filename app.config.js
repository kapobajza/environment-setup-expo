const packageJson = require('./package.json');
/** @type {import('./src/config').ExpoAppEnv} */
let config = require('./src/config/env');

config = config.default || config;

const appName = config.EXPO_PUBLIC_APP_NAME;

const appId = `com.envsetupwithexpo${config.EXPO_PUBLIC_ENV === 'prod' ? '' : `.${config.EXPO_PUBLIC_ENV}`}`;

/** @type {import('@expo/config').ExpoConfig} */
module.exports = {
  name: 'env-setup-with-expo',
  slug: 'env-setup-with-expo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
      CFBundleDisplayName: appName,
      CFBundleVersion: packageJson.bundle_version,
    },
    bundleIdentifier: appId,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: appId,
    versionCode: packageJson.version_code,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router', ['./plugins/update_android_app_name.js', { appName }]],
  experiments: {
    typedRoutes: true,
  },
};
