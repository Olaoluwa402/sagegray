import axios from "axios";
import { toast } from "react-toastify";
import { ICharacter } from "./interface";

const baseUrl = "https://swapi.dev/api/people";

export const getCharactersReq = async (
  searchText?: string
): Promise<ICharacter[]> => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const url = searchText ? `${baseUrl}?search=${searchText}` : baseUrl;
    const { data } = await axios.get(url, config);

    return data.results as ICharacter[];
  } catch (err: any) {
    console.error(err, "err");
    toast.error(err.message);
    return [];
  }
};
export const getCharacterDetailReq = async (
  id: number
): Promise<ICharacter | null> => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const { data } = await axios.get(`${baseUrl}/${id}`, config);

    return data as ICharacter;
  } catch (err: any) {
    console.error(err, "err");
    toast.error(err.message);
    return null;
  }
};
