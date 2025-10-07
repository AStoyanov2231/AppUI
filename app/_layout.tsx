import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ActivityIndicator, Animated, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { config, getXamppUrl } from '../config';

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

  const getIndicatorStyle = (tabName: string) => {
    return [
      styles.indicator,
      activeTab === tabName && styles.activeIndicator
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

      <View 
        style={[
          styles.navigationContainer,
          {
            bottom: Platform.OS === 'android' ? insets.bottom : 0
          }
        ]}
      >
        <View style={styles.fallbackNavigation}>
          <View style={styles.tabContainer}>
            <View style={getIndicatorStyle('places')} />
            <TouchableOpacity
              style={getButtonStyle('places')}
              onPress={() => navigateToPage('?app=1', 'places')}
            >
              <MaterialIcons name="place" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.tabContainer}>
            <View style={getIndicatorStyle('chat')} />
            <TouchableOpacity
              style={getButtonStyle('chat')}
              onPress={() => navigateToPage('?view=chat&app=1', 'chat')}
            >
              <MaterialIcons name="forum" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.tabContainer}>
            <View style={getIndicatorStyle('profile')} />
            <TouchableOpacity
              style={getButtonStyle('profile')}
              onPress={() => navigateToPage('?view=account&app=1', 'profile')}
            >
              <MaterialIcons name="person" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  navigationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  fallbackNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingVertical: 0,
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 0,
    position: 'relative',
  },
  navButton: {
    backgroundColor: '#6366f1',
    marginHorizontal: 20,
    paddingVertical: 4,
    paddingHorizontal: 25,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 36,
    minHeight: 50,
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOpacity: 0.45,
    shadowRadius: 4,
  },
  activeNavButton: {
    elevation: 6,
    shadowOpacity: 0.35,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 0,
    width: 0,
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 5,
    width: 70,
    backgroundColor: '#6366f1',
    borderRadius: 2,
    marginTop: 4,
  },
});