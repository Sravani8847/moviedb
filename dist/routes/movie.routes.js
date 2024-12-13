"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const movieController = require('../controllers/movie.controller');
const router = (0, express_1.Router)();
exports.router = router;
router.get("/", (req, res) => {
    res.json({ message: "movie route healthcheck is working." });
});
router.get('/getmoviebyyear', movieController.getAllMovieByYear);
