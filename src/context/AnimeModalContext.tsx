import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { AnimeData } from '@umamusumeenjoyer/shared-logic';
import AnimeModal from '../components/AnimeModal/AnimeModal';

interface AnimeModalContextProps {
  showModal: (anime: AnimeData) => void;
  hideModal: () => void;
}

const AnimeModalContext = createContext<AnimeModalContextProps | undefined>(undefined);

export const AnimeModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedAnime, setSelectedAnime] = useState<AnimeData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showModal = (anime: AnimeData) => {
    setSelectedAnime(anime);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  return (
    <AnimeModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <AnimeModal visible={isVisible} anime={selectedAnime} onClose={hideModal} />
    </AnimeModalContext.Provider>
  );
};

export const useAnimeModal = () => {
  const context = useContext(AnimeModalContext);
  if (context === undefined) {
    throw new Error('useAnimeModal must be used within an AnimeModalProvider');
  }
  return context;
};
