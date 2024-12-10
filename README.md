# Movie API Project

This project connects to The Movie Database (TMDb) API to fetch movie details based on a specific year, including the movie's editors.

## Setup

### 1. Clone the repository

### 2. Install dependencies
   cmd:/> npm i

### 3. Configure environment variables

Create a `.env` file in the root directory and add your TMDb API token like this:

```bash
TMDB_TOKEN='your_tmdb_api_token_here'
BASE_URL='https://api.themoviedb.org/3'
```

Or

cp .env.sample .env

You can get an API token by signing up at [TMDb](https://www.themoviedb.org/).

### 4. Run the application

Start the app with:

```bash
npm run build
npm run start
```
Or
npm run dev

## For test:
npm run test

The app will fetch movies for the specified year and log the results to the console.

## Files

- `.gitignore`: Ignores sensitive files like `.env`.
- `.env`: Stores your TMDb API token.
- `server.ts`: Main application file.

## Troubleshooting

- **"TMDB_API_TOKEN is not defined"**: Make sure you added your token to the `.env` file.
- **Fetch errors**: Check if your API key is correct and not expired.

APIS: -

http://localhost:3000/movie/

http://localhost:3000/movie/getmoviebyyear?page=1&year=2024