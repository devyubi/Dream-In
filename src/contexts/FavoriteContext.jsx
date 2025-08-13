import { createContext, useContext, useEffect, useState } from "react";

const FavoriteContext = createContext();

export const FavoritesProvider = ({ children }) => {
  // 로컬스토리지에서 초기값 불러오기
  const [favoriteDreams, setFavoriteDreams] = useState(() => {
    const stored = localStorage.getItem("favoriteDreams");
    return stored ? JSON.parse(stored) : [];
  });

  const [favoriteEmotions, setFavoriteEmotions] = useState(() => {
    const stored = localStorage.getItem("favoriteEmotions");
    return stored ? JSON.parse(stored) : [];
  });

  // 로컬스토리지 동기화
  useEffect(() => {
    localStorage.setItem("favoriteDreams", JSON.stringify(favoriteDreams));
  }, [favoriteDreams]);

  useEffect(() => {
    localStorage.setItem("favoriteEmotions", JSON.stringify(favoriteEmotions));
  }, [favoriteEmotions]);

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
