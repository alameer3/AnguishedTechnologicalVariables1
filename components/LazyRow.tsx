import React, { lazy, Suspense } from 'react';
import ImprovedSkeleton from './ImprovedSkeleton';

// Lazy load المكونات الثقيلة
const RowComponent = lazy(() => import('./Row'));

import { Movie } from '../typings';

interface LazyRowProps {
  title: string;
  movies: Movie[];
  isLargeRow?: boolean;
}

const LazyRow: React.FC<LazyRowProps> = ({ title, movies, isLargeRow }) => {
  return (
    <Suspense fallback={<ImprovedSkeleton type="card" count={5} />}>
      <RowComponent title={title} movies={movies} isDetails={false} type="movie" />
    </Suspense>
  );
};

export default LazyRow;