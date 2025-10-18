# Building for Android
From frontend dir:
If running for the first time do npx expo prebuild 


npx expo prebuild --clean
cd android 
./gradlew assembleRelease

File is in android/app/build/outputs/apk/release/app-release.apk


## Releasing on github
git tag <tag>
git push origin <tag>