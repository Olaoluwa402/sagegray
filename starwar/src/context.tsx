import React, { useState, useCallback, useEffect } from "react";
import { getCharactersReq, getCharacterDetailReq } from "./ApiRequests/starwar";
import { FavoriteItem, LoadingState, ProviderProps, Store } from "./interface";
import { ICharacter } from "./ApiRequests/interface";

const GlobalContext = React.createContext<Store | undefined>(undefined);

const Provider = ({ children }: ProviderProps) => {
  const [isLoading, setIsLoading] = useState<LoadingState>({
    getCharacters: false,
    getCharacterDetail: false,
  });
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [character, setCharacter] = useState<ICharacter | null>(null);
  const [searchText, setSearchText] = useState<string | "">("");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [searchList, setSearchList] = useState<string[]>([]);
  const isLoadingHandler = (key: string, state: boolean) => {
    setIsLoading((prev) => ({
      ...prev,
      [key]: state,
    }));
  };

  const getCharacters = useCallback(async (searchText?: string) => {
    isLoadingHandler("getCharacters", true);

    const data = await getCharactersReq(searchText);
    setCharacters(data);

    isLoadingHandler("getCharacters", false);
  }, []);

  const getCharacterDetail = useCallback(async (id: number) => {
    isLoadingHandler("getCharacterDetail", true);

    const data = await getCharacterDetailReq(id);
    setCharacter(data);

    isLoadingHandler("getCharacterDetail", false);
  }, []);

  const getFavorites = (): FavoriteItem[] => {
    const favorites = localStorage.getItem("favorites");
    const result = favorites ? JSON.parse(favorites) : [];
    setFavorites(result);
    return result;
  };

  const getPreviousSearch = (): string[] => {
    const searchList = localStorage.getItem("searchList");
    const result = searchList ? JSON.parse(searchList) : [];
    setSearchList(result);
    return result;
  };

  const addToFavorites = (item: FavoriteItem): void => {
    const favorites = getFavorites();
    const itemExists = favorites.some((favorite) => favorite.id === item.id);
    if (!itemExists) {
      favorites.push(item);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  };

  const addToSearchList = (item: string): void => {
    const searchList = getPreviousSearch();
    const itemExists = searchList.some((text) => text === item);
    if (!itemExists) {
      searchList.push(item);
      localStorage.setItem("searchList", JSON.stringify(searchList));
    }
  };

  const removeFromFavorites = (itemId: number): void => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(
      (favorite) => favorite.id !== itemId
    );
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    getCharacters();
    getFavorites();
    getPreviousSearch();
  }, []);

  // Store object with states and methods
  const store: Store = {
    isLoading,
    setIsLoading,
    characters: characters,
    character: character,
    getCharacterDetail: getCharacterDetail,
    searchText: searchText,
    setSearchText: setSearchText,
    getCharacters: getCharacters,
    favorites: favorites,
    getFavorites: getFavorites,
    addToFavorites: addToFavorites,
    removeFromFavorites: removeFromFavorites,
    searchList: searchList,
    addToSearchList: addToSearchList,
    getPreviousSearch: getPreviousSearch,
  };

  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  );
};

export { Provider, GlobalContext };
