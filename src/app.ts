import express, { Application, Request, Response, NextFunction } from "express";
const cors = require('cors');
import { router as movieRoutes } from "./routes/movie.routes";

const app: Application = express();
const PORT: Number = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: '*', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true,
}));

app.use("/movie", movieRoutes);

app.use("/", (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: "App is working..." });
});

export default app;
