import { Link } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useContext } from "react";
import { Store } from "../../interface";
import { FaTrash } from "react-icons/fa";

const Sidebar = () => {
  const { favorites, removeFromFavorites, getFavorites } = useContext(
    GlobalContext
  ) as Store;

  function removeFavHandler(id: number) {
    removeFromFavorites(id);
    getFavorites();
  }

  const truncateText = (text: string): string => {
    const maxLength = 6;
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="h-screen fixed top-0 left-0 bg-gray-900 text-white w-64 shadow-lg z-50">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Star Wars App</h1>
      </div>
      <nav className="mt-10">
        <ul>
          {favorites.length ? (
            favorites.map((item) => (
              <li
                key={item.id}
                className="mb-4 flex items-center justify-around"
              >
                <Link
                  to={`/characters${item.id}`}
                  className="block px-4 py-2 hover:bg-gray-800 rounded transition duration-200"
                >
                  {truncateText(item?.name as string)}
                </Link>
                <FaTrash
                  className="cursor-pointer"
                  onClick={() => removeFavHandler(item.id)}
                />
              </li>
            ))
          ) : (
            <p>No favorite</p>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
