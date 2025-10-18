# Building for Android
From frontend dir:
If running for the first time do npx expo prebuild 


npx expo prebuild 
cd android 
./gradlew assembleRelease

File is in android/app/build/outputs/apk/release/app-release.apk

## When Clean is needed
✅ Adding/removing native dependencies (new npm packages with native code)
✅ Changing app.json/app.config.js configuration (like permissions, package name, etc.)
✅ Upgrading Expo SDK version
✅ When native code gets corrupted or you have weird build errors

npx expo prebuild --clean
cd android 
./gradlew assembleRelease


## Releasing on github
git tag <tag>
git push origin <tag>

