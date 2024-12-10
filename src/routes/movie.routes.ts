import { Router, Request, Response } from "express";
const movieController = require('../controllers/movie.controller')

const router = Router();

router.get("/", (req: Request, res: Response): void => {
  res.json({ message: "movie route healthcheck is working." });
});

router.get('/getmoviebyyear', movieController.getAllMovieByYear)

export { router };
