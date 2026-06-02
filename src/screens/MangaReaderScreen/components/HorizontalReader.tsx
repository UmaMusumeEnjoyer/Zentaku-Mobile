import React, { useRef, useState } from 'react';
import { FlatList, Dimensions, StyleSheet, ViewToken } from 'react-native';
import type { MangaPage } from '../MangaReader.types';
import PageImage from './PageImage';

interface HorizontalReaderProps {
  pages: MangaPage[];
  onScroll?: () => void;
  onPageChange: (pageNumber: number) => void;
}

const HorizontalReader: React.FC<HorizontalReaderProps> = ({ pages, onScroll, onPageChange }) => {
  const { width } = Dimensions.get('window');
  
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const firstVisible = viewableItems[0].item as MangaPage;
      onPageChange(firstVisible.pageNumber);
    }
  }).current;

  return (
    <FlatList
      data={pages}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScrollBeginDrag={onScroll}
      renderItem={({ item }) => (
        <PageImage url={item.url} width={width} />
      )}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      windowSize={5}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      removeClippedSubviews={true}
      // Start from right to left if reading manga right-to-left
      // Note: Full RTL support might require inverted={true} and reversing data. We will keep it simple LTR for now or rely on device locale.
    />
  );
};

export default React.memo(HorizontalReader);
