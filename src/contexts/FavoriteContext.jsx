import { createContext, useContext, useState } from "react";

const FavoriteContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteDreams, setFavoriteDreams] = useState([]);
  const [favoriteEmotions, setFavoriteEmotions] = useState([]);

  const toggleDreamFavorite = item => {
    setFavoriteDreams(prev => {
      const exists = prev.find(d => d.id === item.id);
      return exists ? prev.filter(d => d.id !== item.id) : [...prev, item];
    });
  };
  const toggleEmotionFavorite = item => {
    setFavoriteEmotions(prev => {
      const exists = prev.find(e => e.id === item.id);
      return exists ? prev.filter(e => e.id !== item.id) : [...prev, item];
    });
  };

  // const toggleEmotionFavorite = emotion => {
  //   setFavoriteEmotions(prev => {
  //     if (prev.some(f => f.id === emotion.id)) {
  //       return prev.filter(f => f.id !== emotion.id);
  //     } else {
  //       return [...prev, emotion];
  //     }
  //   });
  // };

  return (
    <FavoriteContext.Provider
      value={{
        favoriteDreams,
        favoriteEmotions,
        toggleDreamFavorite,
        toggleEmotionFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
