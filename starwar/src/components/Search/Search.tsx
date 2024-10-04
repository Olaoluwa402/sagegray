import { useContext } from "react";
import { GlobalContext } from "../../context";
import { Store } from "../../interface";
import CharacterCard from "../../components/CharacterCard/CharacterCard";

const Search = () => {
  const { characters } = useContext(GlobalContext) as Store;

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full px-4">
        {characters.length ? (
          characters.map((character) => (
            <CharacterCard key={character.url} character={character} />
          ))
        ) : (
          <div className="min-h-screen bg-gray-900 flex text-white justify-center items-center py-10">
            No search result
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
