import React, { useState, useEffect } from 'react';
import { Image, Dimensions, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

interface PageImageProps {
  url: string;
  width: number;
}

const PageImage: React.FC<PageImageProps> = ({ url, width }) => {
  const { theme } = useTheme();
  const [aspectRatio, setAspectRatio] = useState<number>(0.7); // default manga aspect ratio approx
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    if (!url) return;

    Image.getSize(
      url,
      (w, h) => {
        if (isActive && w && h) {
          setAspectRatio(w / h);
          setLoading(false);
        }
      },
      () => {
        // Fallback on error
        if (isActive) setLoading(false);
      }
    );

    return () => {
      isActive = false;
    };
  }, [url]);

  return (
    <View style={[styles.container, { width, height: width / aspectRatio }]}>
      <Image
        source={{ uri: url }}
        style={{ width, height: width / aspectRatio }}
        resizeMode="contain"
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <View style={[styles.loaderContainer, { backgroundColor: theme.bgApp }]}>
          <ActivityIndicator color={theme.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default React.memo(PageImage);
