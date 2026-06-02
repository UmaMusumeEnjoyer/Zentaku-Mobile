import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, ActivityIndicator, Text, StatusBar } from 'react-native';
import { useMangaReader } from './useMangaReader';
import VerticalReader from './components/VerticalReader';
import HorizontalReader from './components/HorizontalReader';
import ReaderControls from './components/ReaderControls';
import { useTheme } from '../../context/ThemeContext';

const MangaReaderScreen: React.FC = () => {
  const {
    isLoading,
    error,
    mangaDetails,
    chapterInfo,
    pages,
    settings,
    currentPage,
    actions
  } = useMangaReader();

  const { theme } = useTheme();
  
  const [controlsVisible, setControlsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: controlsVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [controlsVisible, fadeAnim]);

  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
  };

  const handleScroll = () => {
    if (controlsVisible) {
      setControlsVisible(false);
    }
  };

  if (isLoading && pages.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: '#000' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: '#000' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Text style={{ color: theme.statusError }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar hidden={!controlsVisible} barStyle="light-content" backgroundColor="rgba(0,0,0,0.85)" />
      
      <TouchableWithoutFeedback onPress={toggleControls}>
        <View style={StyleSheet.absoluteFill}>
          {settings.direction === 'vertical' ? (
            <VerticalReader 
              pages={pages} 
              onScroll={handleScroll} 
            />
          ) : (
            <HorizontalReader 
              pages={pages} 
              onScroll={handleScroll} 
              onPageChange={actions.goToPage} 
            />
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* Controls Overlay */}
      <Animated.View 
        style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]} 
        pointerEvents={controlsVisible ? 'box-none' : 'none'}
      >
        <ReaderControls
          title={mangaDetails?.title || 'Unknown Manga'}
          chapterTitle={chapterInfo?.title || ''}
          currentPage={currentPage}
          totalPages={pages.length}
          settings={settings}
          onUpdateSetting={actions.updateSetting}
          onNextChapter={actions.nextChapter}
          onPrevChapter={actions.prevChapter}
        />
      </Animated.View>
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
  }
});

export default MangaReaderScreen;
