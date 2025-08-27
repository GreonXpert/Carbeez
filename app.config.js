import 'dotenv/config';

export default {
  expo: {
    name: "carbeezMobile",
    slug: "carbeezMobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
       infoPlist: {
        "NSMicrophoneUsageDescription": "This app uses the microphone to allow you to send voice messages."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      "package": "com.fazil.carbeezmobile",
      "edgeToEdgeEnabled": true
    },
     permissions: [
      "android.permission.RECORD_AUDIO"
    ],
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY, // This will now work correctly
      googleCloudCredentials: process.env.GOOGLE_CLOUD_CREDENTIALS,
      eas: {
        projectId: "f0045a1f-2e6e-464a-8bed-6326d7e9f6d8"
      }
    },
    plugins: [
      "expo-font"
    ]
  }
};