import { Link } from "react-router-dom";
import { ICharacter } from "../../ApiRequests/interface";
import { FaUser, FaMars, FaGlobe, FaFilm } from "react-icons/fa";

interface CharacterCardProp {
  character: ICharacter;
}
const CharacterCard = ({ character }: CharacterCardProp) => {
  const id = character.url.match(/\/(\d+)\//)?.[1];
  return (
    <Link to={`/characters/${id}`}>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          {character.name}
        </h2>
        <div className="flex items-center mb-2">
          <FaUser className="text-blue-400 mr-2" />
          <span>Birth Year: {character.birth_year}</span>
        </div>
        <div className="flex items-center mb-2">
          <FaMars className="text-blue-400 mr-2" />
          <span>Gender: {character.gender}</span>
        </div>
        <div className="flex items-center mb-2">
          <FaGlobe className="text-blue-400 mr-2" />
          <span>Homeworld: {character.homeworld}</span>
        </div>
        <div className="flex items-center mb-2">
          <FaFilm className="text-blue-400 mr-2" />
          <span>Films: {character.films.length}</span>
        </div>
      </div>
    </Link>
  );
};

export default CharacterCard;
