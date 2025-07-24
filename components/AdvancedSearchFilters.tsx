import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FunnelIcon, XMarkIcon } from './Icons';

interface SearchFilters {
  type: 'all' | 'movie' | 'tv' | 'person';
  genre: string;
  year: string;
  rating: string;
  language: string;
  sortBy: 'popularity' | 'rating' | 'release_date' | 'title';
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const genres = [
    { id: '', name: 'جميع الأنواع' },
    { id: '28', name: 'أكشن' },
    { id: '35', name: 'كوميديا' },
    { id: '18', name: 'دراما' },
    { id: '27', name: 'رعب' },
    { id: '10749', name: 'رومانسي' },
    { id: '878', name: 'خيال علمي' },
    { id: '53', name: 'إثارة' },
    { id: '16', name: 'أنيميشن' },
    { id: '80', name: 'جريمة' },
    { id: '99', name: 'وثائقي' }
  ];

  const years = [
    { value: '', label: 'جميع السنوات' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2010-2019', label: '2010-2019' },
    { value: '2000-2009', label: '2000-2009' },
    { value: '1990-1999', label: '1990-1999' }
  ];

  const ratings = [
    { value: '', label: 'جميع التقييمات' },
    { value: '9', label: '9+ نجوم' },
    { value: '8', label: '8+ نجوم' },
    { value: '7', label: '7+ نجوم' },
    { value: '6', label: '6+ نجوم' },
    { value: '5', label: '5+ نجوم' }
  ];

  const languages = [
    { value: '', label: 'جميع اللغات' },
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'الإنجليزية' },
    { value: 'fr', label: 'الفرنسية' },
    { value: 'es', label: 'الإسبانية' },
    { value: 'ko', label: 'الكورية' },
    { value: 'ja', label: 'اليابانية' },
    { value: 'hi', label: 'الهندية' }
  ];

  const sortOptions = [
    { value: 'popularity', label: 'الأكثر شهرة' },
    { value: 'rating', label: 'التقييم' },
    { value: 'release_date', label: 'تاريخ الإصدار' },
    { value: 'title', label: 'الاسم' }
  ];

  const contentTypes = [
    { value: 'all', label: 'الكل' },
    { value: 'movie', label: 'أفلام' },
    { value: 'tv', label: 'مسلسلات' },
    { value: 'person', label: 'مشاهير' }
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      type: 'all',
      genre: '',
      year: '',
      rating: '',
      language: '',
      sortBy: 'popularity'
    });
  };

  const hasActiveFilters = filters.type !== 'all' || filters.genre || filters.year || filters.rating || filters.language || filters.sortBy !== 'popularity';

  return (
    <div className={`relative ${className}`}>
      {/* زر فتح الفلاتر */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg border transition-all duration-200 ${
          hasActiveFilters
            ? 'bg-red-600 border-red-600 text-white'
            : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
        }`}
      >
        <FunnelIcon className="w-4 h-4" />
        <span>فلاتر متقدمة</span>
        {hasActiveFilters && (
          <span className="bg-white text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
            {[filters.type !== 'all', filters.genre, filters.year, filters.rating, filters.language, filters.sortBy !== 'popularity'].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* لوحة الفلاتر */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-600 rounded-lg shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">فلاتر البحث المتقدمة</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* نوع المحتوى */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نوع المحتوى</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value as any)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                >
                  {contentTypes.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* النوع */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">النوع</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                >
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>

              {/* السنة */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">سنة الإصدار</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                >
                  {years.map(year => (
                    <option key={year.value} value={year.value}>{year.label}</option>
                  ))}
                </select>
              </div>

              {/* التقييم */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">التقييم</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                >
                  {ratings.map(rating => (
                    <option key={rating.value} value={rating.value}>{rating.label}</option>
                  ))}
                </select>
              </div>

              {/* اللغة */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">اللغة</label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>

              {/* الترتيب */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ترتيب حسب</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                إعادة تعيين
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                تطبيق الفلاتر
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearchFilters;