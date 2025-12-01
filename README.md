# Notesy - Cross-Platform Sticky Notes App

**Notesy** is a React Native sticky notes application for iOS and Android. Create, edit, and organize colorful sticky notes with persistent storage and analytics tracking.

## 🚀 App Status: IN CLOSED TESTING - RECRUITING TESTERS

This project is in **CLOSED TESTING** phase. AAB file (v1.0.2) is built and ready. Currently recruiting 12+ testers for the required 14-day testing period before production release.

## ✨ Features

- **Create & Edit Notes**: Simple sticky note interface with rich text support
- **Color-Coded Notes**: 6 beautiful colors that cycle automatically
- **Persistent Storage**: Notes saved locally with AsyncStorage
- **Smart Timestamps**: Shows "Today", "Yesterday", or formatted dates
- **Firebase Analytics**: Tracks app usage and user interactions
- **Cross-Platform**: iOS and Android support
- **Custom Font**: Beautiful "Rounded Mplus 1c Bold" typography
- **Keyboard Management**: Smart keyboard show/hide controls

## 📱 Project Information

- **App Name**: Notesy
- **Package**: com.notesy (Android) / com.joeranft.notesy (iOS)
- **Version**: 1.1.0 (Build: 1)
- **Framework**: React Native 0.76.5 with TypeScript
- **Target SDK**: Android 35, iOS 15.1+
- **Firebase Project**: notesy-ios (with Android app added)

## 🔧 Quick Setup

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## 🏗️ Production Builds

### iOS App Store / TestFlight

For iOS deployment, you need Xcode 16.1+ installed:

1. Open the workspace: `open ios/Notesy.xcworkspace`
2. Select "Any iOS Device" as destination
3. **Product → Archive**
4. When complete, distribute to TestFlight via Organizer window

**Important iOS Notes:**
- Hermes dSYM generation is configured for App Store uploads
- All iPad orientations supported for multitasking
- Automatic code signing configured with Team ID: 223549MKA3
- Firebase Analytics configured with `ios/GoogleService-Info.plist`

### Android Google Play Store

For Google Play Store deployment, you need Android Studio and SDK installed:

#### Build Release AAB
```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

#### Build Release APK (for testing)
```bash
cd android
./gradlew assembleRelease
```

## 🔐 Production Configuration

### iOS Configuration
- **Bundle ID**: com.joeranft.notesy
- **Team ID**: 223549MKA3
- **Deployment Target**: iOS 15.1+
- **Signing**: Automatic (managed by Xcode)
- **Firebase Config**: `ios/GoogleService-Info.plist`

### Android Keystore Information
- **File**: `android/app/notesy-release-key.keystore`
- **Alias**: notesy-key-alias
- **Passwords**: notesy123 (store and key)

### Firebase Analytics
- **Project**: notesy-ios
- **iOS Bundle**: com.joeranft.notesy
- **Android Package**: com.notesy
- **iOS Config**: `ios/GoogleService-Info.plist` (real credentials configured)
- **Android Config**: `android/app/google-services.json` (real credentials configured)

## 📚 Documentation

- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Complete deployment guide for both platforms
- **[GOOGLE_PLAY_DEPLOYMENT_GUIDE.md](./GOOGLE_PLAY_DEPLOYMENT_GUIDE.md)** - Detailed Play Store instructions
- **[NEXT_STEPS_GOOGLE_PLAY.md](./NEXT_STEPS_GOOGLE_PLAY.md)** - Quick reference for Google Play

## 📱 App Architecture

### Dependencies
- `@react-native-firebase/analytics` - User behavior tracking
- `@react-native-async-storage/async-storage` - Local data persistence
- `react-native-device-info` - Device information for analytics
- `lucide-react-native` - Icons and UI elements

### Key Files
- **`App.tsx`** - Main application component
- **`android/app/build.gradle`** - Android build configuration
- **`ios/Notesy.xcodeproj`** - iOS project configuration
- **`android/app/google-services.json`** - Firebase configuration

## ⚠️ Important Notes

- **Keystore Security**: Keep `notesy-release-key.keystore` safe - required for app updates
- **Firebase**: Real credentials are configured for production use
- **Analytics**: App tracks user interactions (app opens, note creation/editing/deletion)
- **Privacy**: Consider adding privacy policy for app store compliance

## 🚀 Deployment Status

### iOS App Store
- ✅ **Xcode Setup**: Xcode 16.1.1 installed and configured
- ✅ **Code Signing**: Automatic signing configured with Apple Developer account
- ✅ **Version**: 1.1.0 (Build 1)
- ✅ **Hermes dSYM**: Configured for App Store uploads
- ✅ **iPad Support**: All orientations enabled for multitasking
- ✅ **Firebase**: Analytics configured with production credentials
- 🚀 **Ready**: Archive and upload to TestFlight via Xcode

### Android Google Play Store
- ✅ **Android Build**: AAB file v1.0.2 built (34MB) - includes text alignment and UX fixes
- ✅ **Firebase**: Production analytics configured with real credentials
- ✅ **Signing**: Production keystore generated and working
- ✅ **Build System**: Android Studio and SDK installed and configured
- ✅ **Google Play Account**: Verified and active
- 🧪 **Closed Testing**: AAB uploaded, recruiting 12+ testers for 14-day testing period
- ⏳ **Production Access**: Waiting for testing period completion
- 📦 **AAB File**: `app/build/outputs/bundle/release/app-release.aab` (v1.0.2, versionCode 2)

## 🔧 Troubleshooting

### Google Play Upload Issues
- Check account verification status at [play.google.com/console](https://play.google.com/console)
- Look for "Create app" button (indicates approved account)
- If still pending, wait for verification email (24-72 hours typical)

### Build System Status (All Complete)
- ✅ `ANDROID_HOME` set to: `~/Library/Android/sdk`
- ✅ Android Studio and SDK installed and working
- ✅ Keystore file exists: `android/app/notesy-release-key.keystore`
- ✅ AAB file built successfully: `app/build/outputs/bundle/release/app-release.aab`

### Firebase Configuration (Complete)
- ✅ `google-services.json` has real production values
- ✅ Firebase project includes Android app with package `com.notesy`
- ✅ Analytics integration tested and working

## 📞 Support

For deployment help, see [NEXT_STEPS.md](./NEXT_STEPS.md) for detailed instructions.

## 📖 Learn More

- [React Native Website](https://reactnative.dev) - learn more about React Native
- [Google Play Console](https://play.google.com/console/) - app publishing platform
- [Firebase Console](https://console.firebase.google.com/) - analytics and services
