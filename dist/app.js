"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const movie_routes_1 = require("./routes/movie.routes");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use("/movie", movie_routes_1.router);
app.use("/", (req, res, next) => {
    res.json({ message: "App is working..." });
});
exports.default = app;
