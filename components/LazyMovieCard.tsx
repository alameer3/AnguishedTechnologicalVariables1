import React, { lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Lazy load المكونات الثقيلة  
const MovieComponent = lazy(() => 
  import('./Row').then(module => ({ 
    default: ({ movie, index, genre }: any) => (
      <div className="movie-card">
        <h3>{movie.title || movie.name}</h3>
      </div>
    )
  }))
);

interface LazyMovieCardProps {
  movie: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string;
    backdrop_path?: string;
    overview?: string;
    release_date?: string;
    vote_average?: number;
  };
  index: number;
  genre: string;
}

const LazyMovieCard: React.FC<LazyMovieCardProps> = ({ movie, index, genre }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MovieComponent movie={movie} index={index} genre={genre} />
    </Suspense>
  );
};

export default LazyMovieCard;