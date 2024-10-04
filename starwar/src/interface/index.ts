import { ReactNode } from "react";
import { ICharacter } from "../ApiRequests/interface";

// Define types for the state
export interface LoadingState {
  getCharacters: boolean;
  getCharacterDetail: boolean;
}

export interface Store {
  isLoading: LoadingState;
  setIsLoading: React.Dispatch<React.SetStateAction<LoadingState>>;
  characters: ICharacter[];
  character: ICharacter | null;
  getCharacterDetail: (id: number) => Promise<void>;
  searchText: string | "";
  setSearchText: React.Dispatch<React.SetStateAction<string | "">>;
  getCharacters: (searchText?: string) => Promise<void>;
  favorites: FavoriteItem[];
  getFavorites: () => FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (itemId: number) => void;
  searchList: string[];
  addToSearchList: (item: string) => void;
  getPreviousSearch: () => string[];
}

export interface ProviderProps {
  children: ReactNode;
}

export interface FavoriteItem {
  id: number;
  name?: string;
}
