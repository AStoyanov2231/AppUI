import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Platform } from 'react-native';
import { useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { getXamppUrl, config } from '../config';

export default function RootLayout() {
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState(getXamppUrl());
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('places'); // Track active tab
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const navigateToPage = (params: string, tabName: string) => {
    const baseUrl = config.xampp.url;
    const path = config.xampp.path || '';
    const newUrl = `${baseUrl}${path}${params}`;
    
    // Update active tab
    setActiveTab(tabName);
    
    // Check if we're already on the same URL
    if (newUrl === currentUrl) {
      // If same URL, just reload the WebView without showing loading
      if (webViewRef.current) {
        webViewRef.current.reload();
      }
      return;
    }
    
    setCurrentUrl(newUrl);
    setIsLoading(true);
    
    // Fade in loading overlay
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  const handleLoadEnd = () => {
    // Fade out loading overlay
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 10,
      useNativeDriver: true,
    }).start(() => {
      setIsLoading(false);
    });
  };

  const getButtonStyle = (tabName: string) => {
    return [
      styles.navButton,
      activeTab === tabName && styles.activeNavButton
    ];
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={[
          styles.webview,
          {
            marginTop: insets.top,
            marginBottom: Platform.OS === 'android' ? insets.bottom : 0,
          }
        ]}
        key={currentUrl}
        onLoadEnd={handleLoadEnd}
        onLoadStart={() => setIsLoading(true)}
        {...config.webview}
      />
      
      {isLoading && (
        <Animated.View 
          style={[
            styles.loadingOverlay,
            {
              marginTop: insets.top,
              opacity: fadeAnim,
            }
          ]}
        >
          <ActivityIndicator size="large" color="#007AFF" />
        </Animated.View>
      )}

      <BlurView 
        intensity={Platform.OS === 'android' ? 80 : 5}
        tint="light"
        style={[
          styles.blurContainer,
          {
            bottom: Platform.OS === 'android' ? insets.bottom : 0
          }
        ]}
      >
        <View style={styles.fallbackNavigation}>
          <TouchableOpacity
            style={getButtonStyle('places')}
            onPress={() => navigateToPage('?app=1', 'places')}
          >
            <MaterialIcons name="place" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={getButtonStyle('chat')}
            onPress={() => navigateToPage('?view=chat&app=1', 'chat')}
          >
            <MaterialIcons name="forum" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={getButtonStyle('profile')}
            onPress={() => navigateToPage('?view=account&app=1', 'profile')}
          >
            <MaterialIcons name="person" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </BlurView>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  blurContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  fallbackNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  activeNavButton: {
    borderWidth: 2,
    borderColor: '#fff0000',
    elevation: 6,
    shadowOpacity: 0.35,
  },
});