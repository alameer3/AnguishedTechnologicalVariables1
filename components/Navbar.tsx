import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

import { SearchIcon, BellIcon, NetflixIcon } from "./Icons";
import Search from "./Search";
import Breadcrumbs from "./Breadcrumbs";

type Props = {
  isSearch?: boolean;
  setSearchTerm?: (term: string) => void;
  searchTerm?: string;
};

function Navbar({ isSearch, setSearchTerm, searchTerm }: Props) {
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
    <>
      <header
        className={`header transition-all duration-500 ${
          isScrolled 
            ? "bg-black/95 backdrop-blur-xl shadow-2xl border-b border-red-500/20" 
            : "bg-transparent"
        } hover:bg-black/95`}
      >
      <div className="flex items-center space-x-2 md:space-x-10">
        <div className="relative w-[280px] h-[70px] cursor-pointer transition-all duration-300 hover:scale-110 hover:drop-shadow-2xl interactive-glow" onClick={() => router.push("/")}>
          <Image
            src="/yemen-flix-logo.png"
            alt="YEMEN_FLIX"
            fill
            className="object-contain brightness-125 drop-shadow-lg"
            sizes="280px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
        </div>

        <ul className="hidden md:space-x-6 md:flex cursor-pointer">
          <li
            className="cursor-pointer text-[17px] font-medium text-white hover:text-red-400 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-md hover:bg-white/10"
            onClick={() => router.push("/")}
          >
            الرئيسية
          </li>
          <li
            className="cursor-pointer text-[17px] font-medium text-white hover:text-red-400 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-md hover:bg-white/10"
            onClick={() => router.push("/tv")}
          >
            المسلسلات
          </li>
          <li
            className="cursor-pointer text-[17px] font-medium text-white hover:text-red-400 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-md hover:bg-white/10"
            onClick={() => router.push("/")}
          >
            الأفلام
          </li>
          <li
            className="cursor-pointer text-[17px] font-medium text-white hover:text-red-400 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-md hover:bg-white/10"
            onClick={() => router.push("/people")}
          >
            المشاهير
          </li>
          <li
            className="cursor-pointer text-[17px] font-medium text-white hover:text-red-400 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-md hover:bg-white/10"
            onClick={() => router.push("/favourite")}
          >
            المفضلة
          </li>
          <li
            className="cursor-pointer text-[17px] font-medium text-white hover:text-red-400 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-md hover:bg-white/10"
            onClick={() => router.push("/about")}
          >
            حول التطبيق
          </li>
        </ul>
      </div>

      <div className="font-medium flex items-center space-x-5 text-sm">
        {isSearch ? (
          <Search searchTerm={searchTerm || ""} setSearchTerm={setSearchTerm || (() => {})} />
        ) : (
          <SearchIcon
            className="hidden sm:inline sm:w-7 sm:h-7 cursor-pointer hover:text-red-400 transition-colors duration-300 text-white"
            onClick={() => router.push("/")}
          />
        )}
        <BellIcon className="h-7 w-7 cursor-pointer hover:text-red-400 transition-colors duration-300 text-white" />
        <NetflixIcon className="h-7 w-7 cursor-pointer text-red-500 hover:text-red-400 transition-colors duration-300" />
        <div onClick={() => signOut()} className="cursor-pointer group">
          {session?.user?.image ? (
            <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
              <Image
                src={session.user.image}
                alt={session.user.name || "User profile"}
                fill
                className="object-cover rounded-md ring-2 ring-transparent group-hover:ring-red-500"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-red-500 to-red-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl ring-2 ring-red-500/30 group-hover:ring-red-400/60">
              <span className="text-white text-xl font-bold drop-shadow-lg">👤</span>
            </div>
          )}
        </div>
      </div>
      </header>
      
      {/* Breadcrumbs */}
      <div className="px-4 md:px-8 pt-20 pb-2">
        <Breadcrumbs />
      </div>
    </>
  );
}

export default Navbar;
