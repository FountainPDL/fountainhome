# FountainHome APK Build Guide

This guide explains how to build the FountainHome streaming app as an Android APK.

## Prerequisites

- Node.js 20+
- Android SDK (API 35+)
- Java Development Kit (JDK 17+)
- Gradle 8.0+
- Git

## Quick Start - Local Build

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build Next.js

```bash
pnpm run build
```

### 3. Set Up Capacitor

```bash
npm install -g @capacitor/cli
npx cap init "Fountain Home" --web-dir=.next/standalone
npx cap add android
```

### 4. Build APK

#### Debug APK
```bash
cd android
./gradlew assembleDebug
```

The debug APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### Release APK
```bash
cd android
./gradlew bundleRelease \
  -Pandroid.injected.signing.store.file=app/build.keystore \
  -Pandroid.injected.signing.store.password=YOUR_PASSWORD \
  -Pandroid.injected.signing.key.alias=fountain_app \
  -Pandroid.injected.signing.key.password=YOUR_KEY_PASSWORD
```

## GitHub Actions - Automated Build

This repository includes a GitHub Actions workflow that automatically builds APKs on push.

### Configuration

1. Add these secrets to your GitHub repository settings:

```
ANDROID_KEYSTORE_BASE64      # Base64 encoded keystore file
ANDROID_KEYSTORE_PASSWORD    # Keystore password
ANDROID_KEY_PASSWORD         # Key password
TMDB_API_KEY                 # TMDB API key
```

### Encoding Your Keystore

```bash
base64 -i build.keystore -o keystore_base64.txt
# Copy contents of keystore_base64.txt to ANDROID_KEYSTORE_BASE64 secret
```

### Trigger Build

Push to main branch or manually trigger:
```bash
gh workflow run build-apk.yml -f release_type=release
```

## Creating a Keystore

If you don't have a signing key:

```bash
keytool -genkey -v -keystore build.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias fountain_app \
  -storepass your_store_password \
  -keypass your_key_password \
  -dname "CN=Your Name,O=Your Company,L=City,ST=State,C=Country"
```

## Build Configuration

The build process is configured in `build.yml`:

- **Min SDK**: Android 7.0 (API 24)
- **Target SDK**: Android 15 (API 35)
- **Permissions**: Internet, Network Access, Storage Read/Write
- **Features**: Offline mode, Caching, Download management

## Features Included

### Core Features
- ✅ Video streaming from multiple sources
- ✅ Search and browse content
- ✅ Watch history tracking
- ✅ Download management
- ✅ Offline mode with caching

### Technical Features
- ✅ Service Worker for offline support
- ✅ Progressive Web App (PWA) capabilities
- ✅ IndexedDB for local storage
- ✅ Image caching
- ✅ API response caching

## Performance Optimization

### Caching Strategy
- **Images**: Cache-first (TMDB images)
- **API**: Network-first with fallback cache
- **Pages**: Network-first with fallback cache

### Bundle Size
Current estimated APK size: ~50-80 MB (uncompressed)

## Troubleshooting

### Build Fails with Gradle Error
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug
```

### Out of Memory
```bash
export GRADLE_OPTS="-Xmx2048m"
cd android
./gradlew assembleDebug
```

### Service Worker Issues
- Clear browser cache
- Check `/public/sw.js` exists
- Verify service worker registration in console

## Testing

### Local Testing
```bash
# Start dev server
pnpm run dev

# Build production version
pnpm run build
pnpm start

# Open in Chrome DevTools -> Application -> Service Workers
```

### Android Testing
```bash
# Install debug APK on device
adb install android/app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat | grep "fountainhome"

# Clear app data
adb shell pm clear com.fountainstream.app
```

## Distribution

### Direct Download
Build outputs are available in GitHub Actions artifacts after each successful build.

### Google Play Store
1. Create a Google Play Console account
2. Create app entry for "Fountain Home"
3. Prepare store listing
4. Upload APK or App Bundle
5. Submit for review

Note: Ensure compliance with streaming laws in your region.

## Legal Considerations

- ✅ This app uses public TMDB API for metadata
- ✅ Video sources are embedded iframes (third-party responsibility)
- ⚠️ Ensure compliance with local streaming laws
- ⚠️ Respect copyright and content licensing

## Support

For build issues, check:
1. Android SDK Manager - ensure all tools are up to date
2. Java version - must be 17+
3. Node version - must be 20+
4. Gradle version - must be 8.0+

## License

This project is part of FountainHome streaming application.
