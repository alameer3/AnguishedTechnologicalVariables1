const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Ensure API key exists
if (!API_KEY) {
  throw new Error('NEXT_PUBLIC_API_KEY is not defined in environment variables');
}

const peopleRequests = {
  fetchPopular: `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=1`,
};

export default peopleRequests;
