import React, { lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Movie } from '../typings.d';

// Lazy load المكونات الثقيلة  
const MovieComponent = lazy(() => 
  import('./Row').then(module => ({ 
    default: ({ movie, index, genre }: { movie: Movie; index: number; genre?: string }) => (
      <div className="movie-card">
        <h3>{movie.title || movie.name}</h3>
      </div>
    )
  }))
);

interface LazyMovieCardProps {
  movie: Movie;
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