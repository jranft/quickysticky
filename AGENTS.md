# Repository Guidelines

## Project Structure & Module Organization
- Root UI lives in `App.tsx`; app entry is `index.js`.
- Mobile platform config in `android/` and `ios/` (Gradle, Xcode, Firebase configs, assets, keystores).
- UI assets (icons, promo shots) live in `assets/`.
- Unit tests are under `__tests__/` using Jest; metro/babel configs at `metro.config.js` and `babel.config.js`.
- Release helpers: `build-release.sh` for Android; deployment notes in `NEXT_STEPS*.md` and `GOOGLE_PLAY_DEPLOYMENT_GUIDE.md`.

## Build, Test, and Development Commands
- `npm start` — start Metro bundler.
- `npm run ios` / `npm run android` — run the app in simulator/emulator with Metro running.
- `npm run test` — run Jest suite.
- `npm run lint` — run ESLint with the React Native preset.
- Android release artifacts: `cd android && ./gradlew assembleRelease` (APK) or `./gradlew bundleRelease` (AAB). The helper script `./build-release.sh` wraps install + clean + both builds.

## Coding Style & Naming Conventions
- Language: TypeScript/React Native; prefer functional components with hooks.
- Indentation: 2 spaces; single quotes; trailing commas consistent with existing code.
- Naming: components PascalCase (`NoteCard`), hooks camelCase (`useNotes`), constants SCREAMING_SNAKE_CASE.
- State shape is simple objects/arrays; persist via AsyncStorage keys `@sticky_notes` and `@next_note_color`.
- Run `npm run lint` before committing; keep imports ordered: built-ins, libs, local.

## Testing Guidelines
- Framework: Jest with `react-test-renderer`; see `__tests__/App.test.tsx` for pattern.
- Test names: plain English `it('renders correctly')`; co-locate new tests in `__tests__/`.
- For UI/state changes, assert render output and storage/analytics side effects where possible; prefer deterministic data (mock dates and AsyncStorage).
- Target: keep suites fast; avoid networked analytics—mock `@react-native-firebase/analytics`.

## Commit & Pull Request Guidelines
- Commit messages: imperative, short summary (e.g., "moving assets to a new directory", "Updates for Google Play Store submission").
- One logical change per commit; include relevant platform configs if impacted.
- PRs should describe user-facing change, platforms touched (iOS/Android), and test evidence (`npm run test` output, simulator screenshots if UI changes).
- Link issues/task IDs when available; note any config secrets or manual steps needed.

## Security & Configuration Tips
- Firebase configs live in `android/app/google-services.json` and `ios/GoogleService-Info.plist`; avoid committing replacements with production secrets.
- Keep keystore material (`android/app/notesy-release-key.keystore`) private; do not share in PRs.
- For analytics, ensure no PII is logged; device info is already captured in `App.tsx`.
