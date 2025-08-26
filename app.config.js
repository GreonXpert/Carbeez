import 'dotenv/config';

export default {
  expo: {
    name: "carbeezMobile",
    slug: "carbeezMobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    // ... other expo configurations from your app.json
    extra: {
      API_KEY: process.env.API_KEY,
      // Add other environment variables here if needed
      eas: {
        projectId: "f0045a1f-2e6e-464a-8bed-6326d7e9f6d8"
      }
    },
    // ... rest of your app.json configurations
  }
};