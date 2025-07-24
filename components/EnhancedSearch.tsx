import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "../typings";
import { SearchIcon, XMarkIcon, MicrophoneIcon } from "./Icons";

interface EnhancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
}) => {
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    type: 'all', // all, movie, tv, person
    genre: 'all',
    year: 'all',
    rating: 'all'
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus على البحث عند الفتح
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // تحميل عمليات البحث السابقة
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // تأخير البحث لتحسين الأداء
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
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || process.env.TMDB_API_KEY;
        if (!apiKey) {
          setSuggestions([]);
          return;
        }

        let endpoint = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ar&query=${encodeURIComponent(query)}&page=1`;
        
        // تطبيق الفلاتر
        if (filters.type !== 'all') {
          endpoint = `https://api.themoviedb.org/3/search/${filters.type}?api_key=${apiKey}&language=ar&query=${encodeURIComponent(query)}&page=1`;
        }

        const response = await fetch(endpoint);
        const data = await response.json();
        setSuggestions(data.results?.slice(0, 12) || []);
      } catch (error) {
        // Silent error handling
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [filters]
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
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        selectSuggestion(suggestions[selectedIndex]);
      } else if (searchTerm.trim()) {
        performSearch();
      }
    }
  };

  // اختيار اقتراح
  const selectSuggestion = (movie: Movie) => {
    const query = movie.title || movie.name || '';
    setSearchTerm(query);
    addToRecentSearches(query);
    
    router.push({
      pathname: `/details/${movie.id}`,
      query: {
        movieId: movie.id.toString(),
        type: movie.media_type || (movie.title ? 'movie' : 'tv'),
      },
    });
    onClose();
  };

  // البحث الصوتي مع أنواع TypeScript آمنة
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      interface SpeechRecognitionEvent extends Event {
        results: SpeechRecognitionResultList;
      }

      interface SpeechRecognitionResultList {
        [index: number]: SpeechRecognitionResult;
        length: number;
      }

      interface SpeechRecognitionResult {
        [index: number]: SpeechRecognitionAlternative;
        isFinal: boolean;
        length: number;
      }

      interface SpeechRecognitionAlternative {
        transcript: string;
        confidence: number;
      }

      interface SpeechRecognitionConstructor {
        new(): SpeechRecognition;
      }

      interface SpeechRecognition extends EventTarget {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        start(): void;
        stop(): void;
        onresult: ((event: SpeechRecognitionEvent) => void) | null;
        onerror: ((event: Event) => void) | null;
        onend: ((event: Event) => void) | null;
      }

      const windowWithSpeech = window as typeof window & {
        webkitSpeechRecognition: new () => SpeechRecognition;
        SpeechRecognition: new () => SpeechRecognition;
      };
      const SpeechRecognitionClass = windowWithSpeech.webkitSpeechRecognition || windowWithSpeech.SpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsVoiceSearch(true);
      recognition.start();

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsVoiceSearch(false);
      };

      recognition.onerror = () => {
        setIsVoiceSearch(false);
      };

      recognition.onend = () => {
        setIsVoiceSearch(false);
      };
    }
  };

  // إضافة للبحث السابق
  const addToRecentSearches = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // تنفيذ البحث
  const performSearch = () => {
    if (searchTerm.trim()) {
      addToRecentSearches(searchTerm);
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
      onClose();
    }
  };

  const genres = [
    { id: 'all', name: 'جميع الأنواع' },
    { id: '28', name: 'أكشن' },
    { id: '35', name: 'كوميديا' },
    { id: '18', name: 'دراما' },
    { id: '27', name: 'رعب' },
    { id: '10749', name: 'رومانسي' },
    { id: '878', name: 'خيال علمي' },
    { id: '53', name: 'إثارة' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-full max-w-4xl mx-4 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* شريط البحث المحسن */}
          <div className="p-6 border-b border-white/10">
            <div className="relative">
              <div className="flex items-center bg-gray-900/50 rounded-xl border border-white/20 p-4">
                <SearchIcon className="w-6 h-6 text-gray-400 ml-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ابحث عن الأفلام والمسلسلات والمشاهير..."
                  className="flex-1 bg-transparent text-white text-lg placeholder-gray-400 outline-none"
                />
                
                {/* البحث الصوتي */}
                <button
                  onClick={startVoiceSearch}
                  className={`p-2 rounded-lg transition-all ${
                    isVoiceSearch 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <MicrophoneIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg ml-2 transition-all"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* الفلاتر */}
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              <select
                value={filters.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters({...filters, type: e.target.value})}
                className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-white/20"
              >
                <option value="all">جميع الأنواع</option>
                <option value="movie">أفلام</option>
                <option value="tv">مسلسلات</option>
                <option value="person">مشاهير</option>
              </select>

              <select
                value={filters.genre}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters({...filters, genre: e.target.value})}
                className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-white/20"
              >
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* النتائج */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">جاري البحث...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {suggestions.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                      selectedIndex === index 
                        ? 'bg-red-500/20 border border-red-500/50' 
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                    onClick={() => selectSuggestion(item)}
                  >
                    {(item.poster_path || item.profile_path) ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path || item.profile_path}`}
                        alt={item.title || item.name || ""}
                        width={40}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-15 bg-gray-700 rounded-lg flex items-center justify-center">
                        <SearchIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-3 flex-1">
                      <h3 className="text-white text-sm font-medium truncate">
                        {item.title || item.name}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {item.media_type === 'movie' ? 'فيلم' : 
                         item.media_type === 'tv' ? 'مسلسل' : 'شخصية'}
                        {item.release_date && ` • ${new Date(item.release_date).getFullYear()}`}
                        {item.vote_average > 0 && ` • ⭐ ${item.vote_average.toFixed(1)}`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="p-8 text-center text-gray-400">
                لم يتم العثور على نتائج لـ "{searchTerm}"
              </div>
            ) : (
              <div className="p-6">
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-white font-medium mb-3">عمليات البحث الأخيرة</h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchTerm(term)}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedSearch;