import cacheManager from './cacheManager';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// مدة انتهاء صلاحية الكاش (لا محدود أثناء التطوير)
const CACHE_DURATION = process.env.NODE_ENV === 'development' ? Infinity : 30 * 60 * 1000;

interface FetchOptions {
  useCache?: boolean;
  cacheDuration?: number;
  forceRefresh?: boolean;
}

export async function fetchWithCache(
  endpoint: string, 
  cacheKey: string, 
  options: FetchOptions = {}
): Promise<any> {
  const {
    useCache = true,
    cacheDuration = CACHE_DURATION,
    forceRefresh = false
  } = options;

  // إذا كان forceRefresh فلا نستخدم الكاش
  if (!forceRefresh && useCache) {
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      console.log(`🚀 تحميل سريع من الكاش: ${cacheKey}`);
      return cachedData;
    }
  }

  try {
    console.log(`🌐 جلب بيانات جديدة من TMDB: ${cacheKey}`);
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // حفظ البيانات في الكاش
    if (useCache) {
      cacheManager.set(cacheKey, data, cacheDuration);
    }
    
    return data;
  } catch (error) {
    console.error(`خطأ في جلب البيانات لـ ${cacheKey}:`, error);
    
    // في حالة الخطأ، نحاول استخدام البيانات المحفوظة حتى لو انتهت صلاحيتها
    const fallbackData = cacheManager.get(cacheKey);
    if (fallbackData) {
      console.log(`⚠ استخدام البيانات القديمة من الكاش: ${cacheKey}`);
      return fallbackData;
    }
    
    throw error;
  }
}

// طلبات TMDB مع التخزين المؤقت
export const cachedRequests = {
  // الأفلام الرائجة
  fetchTrending: () => fetchWithCache(
    `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
    'trending_movies'
  ),

  // Netflix Originals
  fetchNetflixOriginals: () => fetchWithCache(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_networks=213`,
    'netflix_originals'
  ),

  // الأفلام الأعلى تقييماً
  fetchTopRated: () => fetchWithCache(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    'top_rated_movies'
  ),

  // أفلام الأكشن
  fetchActionMovies: () => fetchWithCache(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=28`,
    'action_movies'
  ),

  // أفلام الكوميديا
  fetchComedyMovies: () => fetchWithCache(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=35`,
    'comedy_movies'
  ),

  // أفلام الرعب
  fetchHorrorMovies: () => fetchWithCache(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=27`,
    'horror_movies'
  ),

  // أفلام الرومانسية
  fetchRomanceMovies: () => fetchWithCache(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=10749`,
    'romance_movies'
  ),

  // الأفلام الوثائقية
  fetchDocumentaries: () => fetchWithCache(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=99`,
    'documentaries'
  ),

  // بحث عن فيلم معين
  searchMovie: (query: string) => fetchWithCache(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
    `search_${query.replace(/\s+/g, '_').toLowerCase()}`
  ),

  // تفاصيل فيلم معين
  getMovieDetails: (movieId: number) => fetchWithCache(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
    `movie_details_${movieId}`
  ),

  // تحديث البيانات يدوياً (force refresh)
  refreshData: async () => {
    console.log('🔄 تحديث جميع البيانات...');
    
    const promises = [
      fetchWithCache(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`, 'trending_movies', { forceRefresh: true }),
      fetchWithCache(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_networks=213`, 'netflix_originals', { forceRefresh: true }),
      fetchWithCache(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`, 'top_rated_movies', { forceRefresh: true }),
      fetchWithCache(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=28`, 'action_movies', { forceRefresh: true }),
      fetchWithCache(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=35`, 'comedy_movies', { forceRefresh: true }),
      fetchWithCache(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=27`, 'horror_movies', { forceRefresh: true }),
      fetchWithCache(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=10749`, 'romance_movies', { forceRefresh: true }),
      fetchWithCache(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=99`, 'documentaries', { forceRefresh: true })
    ];

    await Promise.all(promises);
    console.log('✅ تم تحديث جميع البيانات');
  }
};

export default cachedRequests;