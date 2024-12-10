import { Request, Response } from "express";
import * as MovieService from "../services/movie.service";

// Get all movie by year input
export const getAllMovieByYear = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page, year } = req.query;

    // Check if the required parameters exist
    if (!page || !year) {
      res.status(400).json({
        error: 'Missing required parameters: page and year are required.'
      });
      return;
    }
    if(!isOnlyNumbers(String(page)) || !isOnlyNumbers(String(year))){
      res.status(400).json({
        error: 'Invalid required parameters: page and year should be number.'
      });
      return;
    }

    const movies = await MovieService.getAllMovies(+page, +year);
    res.status(200).json({
      'message': `Movie list fetched based on year ${year}`,
      'data': movies
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

function isOnlyNumbers(input: string): boolean {
  const numberRegex = /^\d+$/;
  return numberRegex.test(input);
}