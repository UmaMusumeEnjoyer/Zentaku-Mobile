import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, StatusBar, TouchableWithoutFeedback, Animated } from 'react-native';
import { useNovelReader } from './useNovelReader';
import NovelControls from './components/NovelControls';
import ReaderSettingsMenu from './components/ReaderSettingsMenu';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/theme';

const NovelReaderScreen: React.FC = () => {
  const {
    novelData,
    chapterData,
    isLoading,
    error,
    viewSettings,
    updateSettings,
    navigateChapter
  } = useNovelReader();

  const { theme } = useTheme();

  const [controlsVisible, setControlsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: controlsVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [controlsVisible, fadeAnim]);

  const toggleControls = () => setControlsVisible(prev => !prev);
  const handleScroll = () => {
    if (controlsVisible) setControlsVisible(false);
  };

  // Derived styles based on viewSettings
  const readerStyles = useMemo(() => {
    const bgColor = viewSettings.theme === 'light' ? '#ffffff' : viewSettings.theme === 'sepia' ? '#f4ecd8' : '#121212';
    const textColor = viewSettings.theme === 'dark' ? '#eeeeee' : '#333333';
    
    return {
      container: { backgroundColor: bgColor },
      text: {
        fontSize: viewSettings.fontSize,
        lineHeight: viewSettings.fontSize * viewSettings.lineHeight,
        color: textColor,
        fontFamily: viewSettings.fontFamily === 'serif' ? 'serif' : 'sans-serif',
        marginBottom: viewSettings.fontSize,
      }
    };
  }, [viewSettings]);

  if (isLoading && !chapterData) {
    return (
      <View style={[styles.center, readerStyles.container]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, readerStyles.container]}>
        <Text style={{ color: theme.statusError }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, readerStyles.container]}>
      <StatusBar 
        hidden={!controlsVisible} 
        barStyle={viewSettings.theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor="rgba(0,0,0,0.85)" 
      />

      <TouchableWithoutFeedback onPress={toggleControls}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          onScrollBeginDrag={handleScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Chapter Title Header inside content */}
          <Text style={[styles.chapterHeading, readerStyles.text, { fontSize: viewSettings.fontSize * 1.5, fontWeight: 'bold' }]}>
            {chapterData?.chapterTitle}
          </Text>

          {chapterData?.paragraphs.map(p => (
            <Text key={p.id} style={[readerStyles.text, p.type === 'dialogue' && { fontStyle: 'italic' }]}>
              {p.text}
            </Text>
          ))}
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Controls Overlay */}
      <Animated.View 
        style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]} 
        pointerEvents={controlsVisible ? 'box-none' : 'none'}
      >
        <NovelControls
          title={novelData?.title || 'Unknown Novel'}
          chapterTitle={chapterData?.chapterTitle || ''}
          onNextChapter={() => navigateChapter('next')}
          onPrevChapter={() => navigateChapter('prev')}
          onOpenSettings={() => setSettingsVisible(true)}
        />
      </Animated.View>

      {/* Settings Modal */}
      <ReaderSettingsMenu 
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        settings={viewSettings}
        onUpdate={updateSettings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing['5'],
    paddingTop: spacing['10'],
    paddingBottom: spacing['10'],
  },
  chapterHeading: {
    marginBottom: spacing['8'],
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  }
});

export default NovelReaderScreen;
