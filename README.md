# WebView App for XAMPP

This React Native app uses Expo Router and WebView to display your XAMPP-hosted website in a mobile app.

## Setup

1. **Configure XAMPP URL**: 
   - Open `app/_layout.tsx`
   - Change the `xamppUrl` variable to point to your XAMPP server
   - Default: `http://localhost:80`
   - For local development: `http://10.0.2.2:80` (Android emulator)
   - For physical device: Use your computer's IP address

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the app**:
   ```bash
   npm start
   ```

## Configuration

### For Android Emulator:
```javascript
const xamppUrl = 'http://10.0.2.2:80';
```

### For Physical Device:
```javascript
const xamppUrl = 'http://192.168.1.100:80'; // Replace with your computer's IP
```

### For iOS Simulator:
```javascript
const xamppUrl = 'http://localhost:80';
```

## Features

- Full WebView support for your XAMPP website
- JavaScript enabled
- DOM storage enabled
- Responsive design
- Safe area handling for different devices

## Troubleshooting

1. **Connection Issues**: Make sure your XAMPP server is running and accessible
2. **Network Security**: For Android, you may need to add network security config
3. **CORS Issues**: Ensure your XAMPP server allows cross-origin requests if needed

## Building for Production

```bash
# For Android
expo build:android

# For iOS
expo build:ios
```
