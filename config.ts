// Configuration for XAMPP WebView App

export const config = {
  // XAMPP Server Configuration
  xampp: {
    // Change this URL to point to your XAMPP server
    // For Android Emulator: http://10.0.2.2:80
    // For Physical Device: http://YOUR_COMPUTER_IP:80
    // For iOS Simulator: http://localhost:80
    url: 'https://myaou.atract.me',
    
    // Optional: Add a specific path to your website
    path: '/index.php',
  },
  
  // WebView Configuration
  webview: {
    javaScriptEnabled: true,
    domStorageEnabled: true,
    startInLoadingState: true,
    scalesPageToFit: true,
    allowsInlineMediaPlayback: true,
    mediaPlaybackRequiresUserAction: false,
  }
};

// Helper function to get the full XAMPP URL
export const getXamppUrl = (): string => {
  const baseUrl = config.xampp.url;
  const path = config.xampp.path || '';
  return `${baseUrl}${path}`;
}; 