import "dotenv/config";

export default {
  expo: {
    name: "astral",
    slug: "astral",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0C111F",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.codeloomventures.astral",
      googleServicesFile:
        process.env.GOOGLE_SERVICES_PLIST ?? "./GoogleService-Info.plist",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.codeloomventures.astral",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
      [
        "expo-updates",
        {
          username: "rajashilan",
        },
      ],
      "expo-font",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-firebase/perf",
      "@react-native-firebase/crashlytics",
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            buildToolsVersion: "34.0.0",
          },
          ios: {
            deploymentTarget: "15.0",
            useFrameworks: "static",
          },
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "9658f287-3074-4ba6-bc82-8c9934ebc656",
      },
    },
    updates: {
      url: "https://u.expo.dev/9658f287-3074-4ba6-bc82-8c9934ebc656",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
