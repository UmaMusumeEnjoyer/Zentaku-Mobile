import React from 'react';
import { FlatList, View, Dimensions, StyleSheet } from 'react-native';
import type { MangaPage } from '../MangaReader.types';
import PageImage from './PageImage';

interface VerticalReaderProps {
  pages: MangaPage[];
  onScroll?: () => void;
}

const VerticalReader: React.FC<VerticalReaderProps> = ({ pages, onScroll }) => {
  const { width } = Dimensions.get('window');

  return (
    <FlatList
      data={pages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PageImage url={item.url} width={width} />}
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={onScroll}
      windowSize={5}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      removeClippedSubviews={true}
    />
  );
};

export default React.memo(VerticalReader);
