import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useCallback, useContext, useEffect, useState } from "react";
import { Store } from "../../interface";
import { debounce } from "../../utils";

const Navigation = () => {
  const [filteredSearches, setFilteredSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const store = useContext(GlobalContext) as Store;
  const debouncedFetchData = useCallback(
    debounce(async (query: string) => {
      if (query) {
        //persit user search query
        store.addToSearchList(query);
        await store.getCharacters(query);
        navigate("/search");
      }
    }, 300),
    []
  );

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    store.setSearchText(value);

    if (value) {
      const filtered = store.searchList.filter((search) =>
        search.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSearches(filtered);
      debouncedFetchData(value);
    } else {
      setFilteredSearches([]);
    }
  };

  const handleSelectSuggestion = async (suggestion: string) => {
    store.setSearchText(suggestion);
    setFilteredSearches([]);

    await store.getCharacters(suggestion);
    navigate("/search");
  };

  useEffect(() => {}, []);
  return (
    <nav className="bg-gray-800 text-white shadow-lg ml-64 sticky top-0">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          {/* Navigation Links */}
          <div className="space-x-6">
            <Link
              to="/"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/characters"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              Characters
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              About
            </Link>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={store.searchText}
              placeholder="Search..."
              className="bg-gray-700 text-white rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={changeHandler}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>

            {/* Autocomplete Dropdown */}
            {filteredSearches.length > 0 && (
              <ul className="absolute left-0 top-full w-full bg-gray-700 text-white rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                {filteredSearches.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-600"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
