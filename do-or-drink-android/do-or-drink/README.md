# Do or Drink (Android)

Standalone version of the Grok-built game, packaged with Capacitor. No server needed: it all runs on-device.

## Get the APK (easiest: GitHub Actions)
1. Create a new GitHub repo and push this folder to the `main` branch.
2. Open the repo's **Actions** tab, run **Build Android APK** (it also runs on every push).
3. When it finishes, download the `do-or-drink-apk` artifact, unzip it, and install `app-debug.apk` on your phone (allow "install unknown apps").

## Build locally (needs Node 22, JDK 21, Android Studio/SDK)
```
npm install
npm run build
npx cap add android          # first time only
npx capacitor-assets generate --android
npx cap sync android
cd android && ./gradlew assembleDebug
```
APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## Notes
- Debug APKs are fine for personal installs. For the Play Store you need a signed release build (`./gradlew bundleRelease` plus a keystore).
- App id is `com.doordrink.app`; change it in `capacitor.config.json` before the first `cap add android`.
- Run in a browser while developing: `npm run dev`.
