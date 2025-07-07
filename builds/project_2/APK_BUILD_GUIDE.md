# Complete APK Build Guide for NofapJourney Flutter App

## Prerequisites
1. Install Flutter SDK: https://flutter.dev/docs/get-started/install
2. Install Android Studio: https://developer.android.com/studio
3. Set up Android SDK and accept licenses

## Step-by-Step APK Build Process

### Method 1: Using Flutter CLI (Recommended)

1. **Open Terminal/Command Prompt**

2. **Navigate to project directory:**
   ```bash
   cd /path/to/nofap_journey
   ```

3. **Get dependencies:**
   ```bash
   flutter pub get
   ```

4. **Check Flutter setup:**
   ```bash
   flutter doctor
   ```
   Fix any issues shown

5. **Build APK:**
   ```bash
   flutter build apk --release
   ```

6. **Find your APK:**
   - Location: `build/app/outputs/flutter-apk/app-release.apk`
   - This is your installable APK file!

### Method 2: Android Studio

1. Open Android Studio
2. Open the project folder
3. Wait for Gradle sync to complete
4. Go to Build > Generate Signed Bundle/APK
5. Select APK and follow the wizard

### Method 3: Debug APK (For Testing)

```bash
flutter build apk --debug
```
APK location: `build/app/outputs/flutter-apk/app-debug.apk`

## Troubleshooting

### Common Issues:

1. **Flutter not found:**
   - Add Flutter to PATH environment variable
   - Restart terminal/command prompt

2. **Android SDK issues:**
   - Run `flutter doctor --android-licenses`
   - Accept all licenses

3. **Gradle build failed:**
   - Check internet connection
   - Run `flutter clean` then `flutter pub get`

4. **Low storage space:**
   - Ensure at least 5GB free space
   - Clear Android Studio cache if needed

## Installation on Phone

1. Enable "Unknown Sources" in phone settings
2. Transfer APK file to phone
3. Tap APK file to install
4. Grant necessary permissions

## File Sizes
- Debug APK: ~50-80MB
- Release APK: ~20-40MB

## Success Indicators
- Build completes without errors
- APK file exists in specified location
- App installs and runs on device
- All features work correctly

Your NofapJourney app is now ready to install on any Android device!