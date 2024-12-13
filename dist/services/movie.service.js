"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMovies = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const API_KEY = process.env.TMDB_TOKEN;
const BASE_URL = process.env.BASE_URL;
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
const getAllMovies = (page = 1, year) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${BASE_URL}/discover/movie?language=en-US&page=${page}&sort_by=popularity.desc${year ? `&primary_release_year=${year}` : ''}`, API_OPTIONS);
        if (!response.ok) {
            throw new Error(`Failed to fetch movies. HTTP status: ${response.status}`);
        }
        const rawData = yield response.json();
        const moviePromises = rawData.results.map((movie) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const editors = yield getMovieEditors(movie.id);
                return {
                    title: movie.title,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    editors,
                };
            }
            catch (_a) {
                return {
                    title: movie.title,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    editors: [],
                };
            }
        }));
        // Process movies in parallel
        return yield Promise.all(moviePromises);
    }
    catch (error) {
        throw new Error(`Failed to fetch movies: ${error.message}`);
    }
});
exports.getAllMovies = getAllMovies;
/**
 * Fetches editors for a specific movie.
 * @param movieId - The ID of the movie.
 * @returns Promise<string[]> - Array of editor names.
 */
const getMovieEditors = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${BASE_URL}/movie/${movieId}/credits?language=en-US`, API_OPTIONS);
        if (!response.ok) {
            console.log(`Failed to fetch credits. HTTP status: ${response.status}`); // Returning [] in case of error
            return [];
        }
        const data = yield response.json();
        return data.crew
            .filter(person => person.known_for_department === 'Editing')
            .map(editor => editor.name);
    }
    catch (error) {
        return [];
    }
});
