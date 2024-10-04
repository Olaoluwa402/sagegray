import {
  FaFilm,
  FaRocket,
  FaCar,
  FaGlobe,
  FaArrowLeft,
  FaStar,
} from "react-icons/fa";
import { ICharacter } from "../../ApiRequests/interface";
import { Link, useParams } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useContext } from "react";
import { Store } from "../../interface";

interface CharacterDetailProp {
  character: ICharacter | null;
}

export const CharacterDetail = ({ character }: CharacterDetailProp) => {
  const { id } = useParams();
  const { removeFromFavorites, addToFavorites, favorites, getFavorites } =
    useContext(GlobalContext) as Store;

  let isFavorite;
  if (id) {
    isFavorite = favorites.find((item) => item.id == +id);
  }

  function addFavHandler() {
    if (id) {
      addToFavorites({ id: +id, name: character?.name });
      getFavorites();
    }
  }

  function removeFavHandler() {
    if (id) {
      removeFromFavorites(+id);
      getFavorites();
    }
  }

  return (
    <>
      {character && (
        <div className="min-h-screen bg-gray-900 text-white p-6 relative">
          <Link to={"/"} className="absolute left-0">
            <FaArrowLeft />
            Back
          </Link>

          {isFavorite ? (
            <FaStar
              size={50}
              className="absolute right-56 top-10 cursor-pointer text-yellow-500"
              onClick={removeFavHandler}
            />
          ) : (
            <FaStar
              size={50}
              className="absolute right-56 top-10 cursor-pointer text-slate-400"
              onClick={addFavHandler}
            />
          )}

          <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
            {/* Character Name */}
            <h1 className="text-4xl font-bold text-blue-400 mb-6 text-center">
              {character.name}
            </h1>

            {/* Basic Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-bold text-gray-400">Birth Year:</p>
                <p>{character.birth_year}</p>
              </div>
              <div>
                <p className="font-bold text-gray-400">Gender:</p>
                <p>{character.gender}</p>
              </div>
              <div>
                <p className="font-bold text-gray-400">Eye Color:</p>
                <p>{character.eye_color}</p>
              </div>
              <div>
                <p className="font-bold text-gray-400">Hair Color:</p>
                <p>{character.hair_color}</p>
              </div>
              <div>
                <p className="font-bold text-gray-400">Height:</p>
                <p>{character.height} cm</p>
              </div>
              <div>
                <p className="font-bold text-gray-400">Mass:</p>
                <p>{character.mass} kg</p>
              </div>
            </div>

            {/* Films Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-blue-400 flex items-center mb-2">
                <FaFilm className="mr-2" /> Films
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {character.films.map((film, index) => (
                  <li key={index}>{film}</li>
                ))}
              </ul>
            </div>

            {/* Species Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-blue-400 flex items-center mb-2">
                <FaGlobe className="mr-2" /> Species
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {character.species.map((species, index) => (
                  <li key={index}>{species}</li>
                ))}
              </ul>
            </div>

            {/* Starships Section */}
            {character.starships.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-blue-400 flex items-center mb-2">
                  <FaRocket className="mr-2" /> Starships
                </h2>
                <ul className="list-disc list-inside space-y-1">
                  {character.starships.map((starship, index) => (
                    <li key={index}>{starship}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vehicles Section */}
            {character.vehicles.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-blue-400 flex items-center mb-2">
                  <FaCar className="mr-2" /> Vehicles
                </h2>
                <ul className="list-disc list-inside space-y-1">
                  {character.vehicles.map((vehicle, index) => (
                    <li key={index}>{vehicle}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer Section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Data last edited on:{" "}
                {new Date(character.edited).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
