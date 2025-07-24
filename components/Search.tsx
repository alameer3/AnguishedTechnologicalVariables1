import React from "react";
import { SearchIcon } from "./Icons";

type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

function Search({ setSearchTerm, searchTerm }: Props) {
  return (
    <div className="hidden md:flex justify-center items-center text-center">
      <div className="bg-gray-900/50 hover:bg-gray-800/70 backdrop-blur-sm border border-gray-700 hover:border-red-500/50 px-4 rounded-xl items-center text-center flex transition-all duration-300 focus-within:border-red-500 focus-within:shadow-lg focus-within:shadow-red-500/20">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="البحث عن فيلم أو مسلسل..."
          className="bg-transparent text-lg font-medium w-[400px] h-[50px] px-4 py-2 rounded-xl placeholder:text-gray-400 placeholder:text-base text-white outline-none transition-all duration-300"
        />
        <button className="px-2.5 hover:scale-110 transition-transform duration-300">
          <SearchIcon className="hidden sm:inline sm:w-6 sm:h-6 cursor-pointer text-gray-400 hover:text-red-400 transition-colors duration-300" />
        </button>
      </div>
    </div>
  );
}

export default Search;
