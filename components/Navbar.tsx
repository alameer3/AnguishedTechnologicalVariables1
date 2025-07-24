import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

import { SearchIcon, BellIcon, NetflixIcon } from "./Icons";
import Search from "./Search";

type Props = {
  isSearch?: boolean;
  setSearchTerm?: (term: string) => void;
  searchThrem?: string;
};

function Navbar({ isSearch, setSearchTerm, searchThrem }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`header ${isScrolled && "bg-[#141414]"} hover:bg-[#141414]`}
    >
      <div className="flex items-center space-x-2 md:space-x-10">
        <div className="relative w-[120px] h-[40px] cursor-pointer" onClick={() => router.push("/")}>
          <Image
            src="/Netflix-Logo.wine.png"
            alt="Netflix Clone"
            fill
            className="object-contain"
            sizes="120px"
            priority
          />
        </div>

        <ul className="hidden md:space-x-4 md:flex cursor-pointer">
          <li
            className="cursor-pointer text-[16px] hover:underline font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"
            onClick={() => router.push("/")}
          >
            Home
          </li>
          <li
            className="cursor-pointer text-[16px] hover:underline font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"
            onClick={() => router.push("/tv")}
          >
            TV Shows
          </li>
          <li
            className="cursor-pointer text-[16px] hover:underline font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"
            onClick={() => router.push("/")}
          >
            Movies
          </li>
          <li
            className="cursor-pointer text-[16px] hover:underline font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"
            onClick={() => router.push("/people")}
          >
            People
          </li>
          <li
            className="cursor-pointer text-[16px] hover:underline font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"
            onClick={() => router.push("/favourite")}
          >
            Favourite
          </li>
          <li
            className="cursor-pointer text-[16px] hover:underline font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"
            onClick={() => router.push("/about")}
          >
            About
          </li>
        </ul>
      </div>

      <div className="font-light flex items-center space-x-4 text-sm">
        {isSearch ? (
          <Search searchThrem={searchThrem || ""} setSearchTerm={setSearchTerm || (() => {})} />
        ) : (
          <SearchIcon
            className="hidden sm:inline sm:w-6 sm:h-6 cursor-pointer"
            onClick={() => router.push("/")}
          />
        )}
        <BellIcon className="h-6 w-6 cursor-pointer" />
        <NetflixIcon className="h-6 w-6 cursor-pointer text-red-800" />
        <div onClick={() => signOut()} className="cursor-pointer">
          {session?.user?.image ? (
            <div className="relative w-8 h-8">
              <Image
                src={session.user.image}
                alt={session.user.name || "User profile"}
                fill
                className="object-cover rounded-sm"
                sizes="32px"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
