import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context";
import { CharacterDetail } from "../../components/CharacterDetail/CharacterDetail";
import { Store } from "../../interface";
import Spinner from "../../components/Spinner/Spinner";

export const CharacterDetailScreen = () => {
  const store = useContext(GlobalContext) as Store;
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      store.getCharacterDetail(+id);
    }
  }, []);

  return store.isLoading.getCharacterDetail ? (
    <div className="h-screen flex justify-center items-center">
      <Spinner />
    </div>
  ) : (
    <CharacterDetail character={store.character} />
  );
};
