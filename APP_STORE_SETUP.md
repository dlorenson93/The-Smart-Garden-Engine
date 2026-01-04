# App Store Setup Guide for TerraPlantari

## Current Configuration

**App Name:** TerraPlantari  
**Bundle ID:** com.terraplantari.app  
**Version:** 1.0.0  
**Build:** 1  

## Pre-Submission Checklist

### 1. Apple Developer Account
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Visit: https://developer.apple.com/programs/
- [ ] Complete enrollment and verification

### 2. App Store Connect Setup
- [ ] Log in to App Store Connect: https://appstoreconnect.apple.com
- [ ] Create new app record
- [ ] Enter app information:
  - **App Name:** TerraPlantari (or your preferred name)
  - **Primary Language:** English
  - **Bundle ID:** com.terraplantari.app
  - **SKU:** terraplantari-ios-001 (or your choice)

### 3. Certificates and Provisioning

#### Development Certificate
```bash
# In Xcode, go to Settings > Accounts
# Add your Apple ID
# Click "Manage Certificates"
# Click "+" and create "Apple Development" certificate
```

#### Distribution Certificate
```bash
# In Xcode Settings > Accounts > Manage Certificates
# Click "+" and create "Apple Distribution" certificate
```

#### App Store Provisioning Profile
- [ ] Go to https://developer.apple.com/account/resources/profiles
- [ ] Create new provisioning profile
- [ ] Select "App Store" distribution
- [ ] Select your app ID (com.terraplantari.app)
- [ ] Select your distribution certificate
- [ ] Download and install

### 4. Build the App for Production

```bash
# 1. Build the frontend
cd frontend
npm run build

# 2. Sync with Capacitor
npx cap sync ios

# 3. Open in Xcode
npx cap open ios
```

### 5. Xcode Configuration

#### In Xcode (ios/App/App.xcodeproj):

**General Tab:**
- [ ] Set **Display Name:** TerraPlantari
- [ ] Set **Bundle Identifier:** com.terraplantari.app
- [ ] Set **Version:** 1.0.0
- [ ] Set **Build:** 1
- [ ] Set **Minimum Deployments:** iOS 15.0 or higher
- [ ] Check **Requires Full Screen:** NO (for better compatibility)

**Signing & Capabilities:**
- [ ] Uncheck "Automatically manage signing"
- [ ] Select your Team
- [ ] Select "App Store" provisioning profile
- [ ] Ensure signing certificate is valid

**Build Settings:**
- [ ] Set **Code Signing Identity (Release):** Apple Distribution
- [ ] Set **Development Team:** [Your Team ID]
- [ ] Set **Provisioning Profile (Release):** [Your App Store Profile]

### 6. Required App Icons

Create icons for all required sizes:

#### Required Sizes (in pixels):
- **1024x1024** - App Store (required, no transparency, no alpha channel)
- **180x180** - iPhone 3x (iPhone 14 Pro Max, 14 Plus, 14 Pro, 14, etc.)
- **167x167** - iPad Pro
- **152x152** - iPad 2x
- **120x120** - iPhone 2x (iPhone SE, 8, 7, etc.)
- **76x76** - iPad 1x

#### Icon Guidelines:
- Use PNG format
- No transparency or alpha channels
- Square with no rounded corners (iOS adds them)
- Should look good at all sizes
- Should represent your gardening/farming app

**To add icons:**
1. Open Xcode
2. Navigate to `App/Assets.xcassets/AppIcon.appiconset`
3. Drag and drop each icon size to the corresponding slot
4. Or use an icon generator tool: https://www.appicon.co/

### 7. Launch Screen (Splash Screen)

**To customize:**
1. Open Xcode
2. Navigate to `App/Assets.xcassets/Splash.imageset`
3. Add your splash screen images:
   - @1x: 640x1136 pixels
   - @2x: 750x1334 pixels
   - @3x: 1242x2208 pixels

Or edit `App/Base.lproj/LaunchScreen.storyboard` for a more customized launch screen.

### 8. Required Privacy Permissions

Update `ios/App/App/Info.plist` with required privacy descriptions:

```xml
<!-- If app uses camera -->
<key>NSCameraUsageDescription</key>
<string>TerraPlantari needs camera access to take photos of your plants and garden progress.</string>

<!-- If app uses photo library -->
<key>NSPhotoLibraryUsageDescription</key>
<string>TerraPlantari needs access to save and retrieve plant photos.</string>

<!-- If app uses location (for climate/zone info) -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>TerraPlantari uses your location to provide accurate climate zone and frost date information for your garden.</string>
```

**Current permissions needed:** Review your app features and add only what you actually use.

### 9. App Metadata for App Store Connect

Prepare the following information:

#### App Information
- **App Name:** TerraPlantari (or your brand name)
- **Subtitle:** Smart Garden & Micro-Farm Planner
- **Category:** Primary: Productivity, Secondary: Lifestyle
- **Content Rights:** Own or have rights to use

#### App Description
```
TerraPlantari is your personal garden and micro-farm planning companion. Designed for both beginner and experienced gardeners, TerraPlantari helps you plan, track, and optimize your garden for maximum yield.

Features:
• Garden Layout Designer - Plan beds, plantings, and spacing
• AI-Powered Assistant - Get personalized gardening advice
• Task Management - Never miss watering, fertilizing, or harvesting
• Companion Planting Guide - Optimize plant placement
• Soil Intelligence - Track and improve soil health
• Weather Integration - Climate-aware recommendations
• Harvest Tracking - Record and analyze your yields
• Seasonal Recommendations - Know what to plant when
• Photo Timeline - Document your garden's progress

Whether you're growing vegetables, herbs, or flowers, TerraPlantari makes gardening easier and more productive.
```

#### Keywords (max 100 characters, comma-separated)
```
garden,planner,farming,vegetables,plants,organic,companion planting,harvest,grow,soil
```

#### Support URL
- Create a simple website or use GitHub Pages
- Example: `https://terraplantari.com/support`

#### Privacy Policy URL (REQUIRED)
- Must host a privacy policy
- Example template location: Create `PRIVACY_POLICY.md`
- Host on GitHub Pages or your website
- Example: `https://terraplantari.com/privacy`

### 10. Screenshots Required

Create screenshots for:

#### iPhone (Required - at least one set)
- **6.7" Display** (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796 pixels
- **6.5" Display** (iPhone 11 Pro Max, XS Max): 1242 x 2688 pixels
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 pixels

**Minimum:** 3 screenshots, Maximum: 10 screenshots per device size

#### iPad (Optional but recommended)
- **12.9" Display** (iPad Pro 12.9"): 2048 x 2732 pixels

**Screenshot Tips:**
- Show key features: Garden layout, AI assistant, task list, planting details
- Use clean, professional designs
- Consider adding text overlays describing features
- Tools: Use iOS Simulator in Xcode or actual device screenshots

### 11. Build and Archive

In Xcode:
1. Select **Product > Archive**
2. Wait for archive to complete
3. In Organizer window, select your archive
4. Click **Distribute App**
5. Select **App Store Connect**
6. Select **Upload**
7. Follow prompts to upload to App Store Connect

### 12. TestFlight (Recommended)

Before public release:
- [ ] Upload build to TestFlight
- [ ] Add internal testers (up to 100)
- [ ] Test app thoroughly
- [ ] Collect feedback
- [ ] Fix any issues
- [ ] Upload new build if needed

### 13. App Review Submission

In App Store Connect:
- [ ] Select your build
- [ ] Complete all required metadata
- [ ] Upload all required screenshots
- [ ] Add app preview video (optional but recommended)
- [ ] Set pricing (Free or Paid)
- [ ] Select territories/countries
- [ ] Add age rating information
- [ ] Submit for review

**Review Time:** Typically 24-48 hours, but can take up to 7 days

### 14. App Review Notes

Provide notes for Apple reviewers:
```
TerraPlantari is a garden planning application that helps users:
- Design and manage garden layouts
- Track plantings and harvests
- Receive AI-powered gardening advice
- Manage garden tasks and schedules

Test Account (if backend requires login):
Username: reviewer@terraplantari.com
Password: [Create a test account]

No special hardware or setup required.
```

## Common Issues and Solutions

### Issue: "Missing Compliance"
**Solution:** In App Store Connect, go to your build and complete the Export Compliance information (usually "No" for most apps).

### Issue: "Invalid Bundle"
**Solution:** Ensure bundle ID matches exactly between Xcode, Capacitor config, and App Store Connect.

### Issue: "Missing Icons"
**Solution:** Ensure all required icon sizes are present in Assets.xcassets/AppIcon.appiconset

### Issue: "Missing Privacy Policy"
**Solution:** Host a privacy policy and add URL in App Store Connect.

### Issue: "Rejected for 2.1 Performance"
**Solution:** Ensure app is complete, fully functional, and not a demo or beta.

## Post-Submission

### After Approval:
- [ ] App appears in App Store
- [ ] Monitor reviews and ratings
- [ ] Respond to user feedback
- [ ] Plan updates based on user needs

### Version Updates:
1. Increment version number in `package.json` and Xcode
2. Build new archive
3. Upload to App Store Connect
4. Submit new version for review

## Resources

- Apple Developer: https://developer.apple.com
- App Store Connect: https://appstoreconnect.apple.com
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Capacitor iOS Guide: https://capacitorjs.com/docs/ios

## Quick Command Reference

```bash
# Build frontend
npm run build --workspace=frontend

# Sync Capacitor
npx cap sync ios

# Open in Xcode
npx cap open ios

# Run on simulator
npx cap run ios

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/ios@latest
npx cap sync ios
```

---

**Good luck with your App Store submission! 🚀🌱**
