#!/bin/bash

# Notesy - Android Release Build Script
# This script builds both APK and AAB files for Google Play Store deployment

set -e

echo "🚀 Building Notesy for Google Play Store..."
echo "================================================"

# Set Android environment
export ANDROID_HOME=/workspace/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
npm install

echo "🧹 Cleaning previous builds..."
cd android
./gradlew clean

echo "📱 Building Release APK..."
./gradlew assembleRelease

echo "📦 Building Release AAB (for Play Store)..."
./gradlew bundleRelease

echo "✅ Build completed successfully!"
echo "================================================"
echo "📁 Generated files:"
echo "   APK: android/app/build/outputs/apk/release/app-release.apk"
echo "   AAB: android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "📋 Next steps:"
echo "   1. Replace android/app/google-services.json with real Firebase config"
echo "   2. Upload app-release.aab to Google Play Console"
echo "   3. Complete store listing and submit for review"
echo ""
echo "🎉 Ready for Google Play Store deployment!"