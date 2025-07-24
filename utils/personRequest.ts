const API_KEY = process.env.NEXT_PUBLIC_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Ensure API key exists
if (!API_KEY) {
  throw new Error('TMDB API key is not defined in environment variables. Please set NEXT_PUBLIC_API_KEY or TMDB_API_KEY.');
}

const peopleRequests = {
  fetchPopular: `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=1`,
};

export default peopleRequests;
