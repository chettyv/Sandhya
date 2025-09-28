# DharmaDaily

Starter Flutter project for the DharmaDaily Hindu spiritual companion app. The scaffold ships with opinionated structure, Riverpod-based state management, Freezed models, sample data, and CI so you can focus on building features like streaks, daily verses, and prayers.

## Prerequisites

- Flutter SDK (3.24.2 or newer). The project targets the stable channel.
- Xcode (for iOS) and Android Studio/SDK (for Android) if you plan to run on simulators or devices.

## Getting Started

1. Clone the repository and open the project directory.
2. Fetch dependencies:
   ```bash
   flutter pub get
   ```
3. Generate model code (re-run whenever Freezed/JSON annotated classes change):
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```
4. Run the app:
   ```bash
   flutter run
   ```
   - Add `-d ios` or `-d android` to target a specific platform/emulator once those toolchains are available.

## Project Structure

```
lib/
  main.dart               # App entry point registering ProviderScope
  src/
    config/               # Routing, theming, and global configuration
    core/                 # Constants, sample data, foundational utilities
    models/               # Freezed data classes
    pages/                # Feature screens
    providers/            # Riverpod providers
    widgets/              # Reusable UI components
assets/
  images/placeholder.png  # Starter art asset referenced during development
  fonts/Manrope-Regular.ttf# Primary app font wired into the theme
```

Key packages:
- `flutter_riverpod` for reactive state management.
- `freezed` and `json_serializable` for immutable models and JSON support.

## Quality Gates

Local checks you can run before opening a PR:
```bash
flutter format --set-exit-if-changed .
flutter analyze
flutter test
```

## Continuous Integration

GitHub Actions is configured in `.github/workflows/flutter_ci.yaml` to install dependencies, enforce formatting, run static analysis, and execute widget tests on every push and pull request to `main`.

## Suggested Next Steps

- Install the Android SDK / create an emulator, then run `flutter run -d android` or `flutter build apk` to validate Android output.
- On macOS, open the project in Xcode (`open ios/Runner.xcworkspace`) and run on an iOS simulator to confirm parity.
- Replace the temporary placeholder image and extend the font family list as final assets become available.
- Expand `sample_data.dart` or connect the providers to your production content backend.
- Add product features like streak tracking, daily reminders, and deeper navigation flows.
