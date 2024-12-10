import dotenv from 'dotenv';
import { Movie, MovieCredits } from '../models/movie';
dotenv.config();

const API_KEY = process.env.TMDB_TOKEN as string;
const BASE_URL = process.env.BASE_URL as string;

// Shared options for API requests
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

/**
 * Fetches movies list based on page and year.
 * @param page - Page number for the results.
 * @param year - The release year to filter movies.
 * @returns Promise<Movie[]> - Array of movies with editor details.
 */
export const getAllMovies = async (page: number = 1, year?: number): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?language=en-US&page=${page}&sort_by=popularity.desc${year ? `&primary_release_year=${year}` : ''}`,
      API_OPTIONS
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movies. HTTP status: ${response.status}`);
    }

    const rawData = await response.json();
    const moviePromises = rawData.results.map(async (movie: any) => {
      try {
        const editors = await getMovieEditors(movie.id);
        return {
          title: movie.title,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          editors,
        };
      } catch {
        return {
          title: movie.title,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          editors: [],
        };
      }
    });

    // Process movies in parallel
    return await Promise.all(moviePromises);
  } catch (error: any) {
    throw new Error(`Failed to fetch movies: ${error.message}`);
  }
};

/**
 * Fetches editors for a specific movie.
 * @param movieId - The ID of the movie.
 * @returns Promise<string[]> - Array of editor names.
 */
const getMovieEditors = async (movieId: number): Promise<string[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?language=en-US`,
      API_OPTIONS
    );

    if (!response.ok) {
      console.log(`Failed to fetch credits. HTTP status: ${response.status}`); // Returning [] in case of error
      return [];
    }

    const data: MovieCredits = await response.json();

    return data.crew
      .filter(person => person.known_for_department === 'Editing')
      .map(editor => editor.name);
  } catch (error) {
    return [];
  }
};
