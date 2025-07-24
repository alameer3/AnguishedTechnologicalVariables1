import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Movie } from "../typings";

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
}) => {
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // التركيز على البحث عند الفتح
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // تأخير البحث لتحسين الأداء مع TypeScript آمن
  const debounce = (func: (query: string) => Promise<void>, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (query: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(query), delay);
    };
  };

  // البحث الفوري مع debounce
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_API_KEY || process.env.TMDB_API_KEY}&language=ar&query=${encodeURIComponent(query)}&page=1`
        );
        const data = await response.json();
        setSuggestions(data.results?.slice(0, 8) || []);
      } catch (error) {
        // Silent error handling
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // التحكم بلوحة المفاتيح
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectMovie(suggestions[selectedIndex]);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    router.push(`/details/${movie.id}?type=${movie.media_type || 'movie'}`);
    onClose();
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl mx-4">
        {/* شريط البحث */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="البحث عن الأفلام والمسلسلات والأشخاص..."
            className="w-full bg-black/90 backdrop-blur-md border border-gray-600 rounded-lg px-6 py-4 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
          />
          
          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* نتائج البحث */}
        {searchTerm.length >= 2 && (
          <div className="mt-4 bg-black/95 backdrop-blur-md border border-gray-700 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400">
                <div className="animate-spin w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                جاري البحث...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {suggestions.map((movie, index) => (
                  <div
                    key={movie.id}
                    className={`flex items-center p-4 cursor-pointer transition-colors ${
                      index === selectedIndex ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                    }`}
                    onClick={() => handleSelectMovie(movie)}
                  >
                    {/* صورة الفيلم */}
                    <div className="relative w-12 h-16 flex-shrink-0 mr-4">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title || movie.name || ""}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">لا توجد صورة</span>
                        </div>
                      )}
                    </div>

                    {/* معلومات الفيلم */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {movie.title || movie.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {movie.media_type === 'movie' ? 'فيلم' : movie.media_type === 'tv' ? 'مسلسل' : 'شخص'}
                        {movie.release_date && ` • ${new Date(movie.release_date).getFullYear()}`}
                        {movie.first_air_date && ` • ${new Date(movie.first_air_date).getFullYear()}`}
                      </p>
                      {movie.overview && (
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                          {movie.overview}
                        </p>
                      )}
                    </div>

                    {/* تقييم */}
                    {movie.vote_average > 0 && (
                      <div className="flex items-center text-yellow-400 ml-4">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                لم يتم العثور على نتائج لـ "{searchTerm}"
              </div>
            )}
          </div>
        )}

        {/* اختصارات لوحة المفاتيح */}
        <div className="mt-4 text-center text-gray-500 text-sm">
          <span className="bg-gray-800 px-2 py-1 rounded text-xs mr-2">↑↓</span>
          للتنقل
          <span className="bg-gray-800 px-2 py-1 rounded text-xs mr-2 ml-4">Enter</span>
          للاختيار
          <span className="bg-gray-800 px-2 py-1 rounded text-xs mr-2 ml-4">Esc</span>
          للإغلاق
        </div>
      </div>
    </div>
  );
};

// دالة debounce للحد من طلبات API
function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default AdvancedSearch;