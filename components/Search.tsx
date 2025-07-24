import React from "react";
import { SearchIcon } from "./Icons";

type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

function Search({ setSearchTerm, searchTerm }: Props) {
  return (
    <div className="hidden md:flex justify-center items-center text-center">
      <div className="bg-transparent hover:bg-gray-900 px-2 rounded items-center text-center flex border border-gray-700">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="البحث عن عناوين وأشخاص وأنواع..."
          className="bg-transparent text-sm font-medium w-[250px] h-[34px] px-3 py-1.5 placeholder:text-sm text-white outline-none"
        />
        <button className="px-2">
          <SearchIcon className="hidden sm:inline sm:w-5 sm:h-5 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

export default Search;
