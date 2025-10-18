#!/bin/bash
echo "sdk.dir=/opt/android-sdk" > android/local.properties
cd android && ./gradlew assembleRelease