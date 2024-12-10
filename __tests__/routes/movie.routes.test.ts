import request from "supertest";
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

import app from "../../src/app";

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("Movie routes test", () => {
  test("healthcheck api", async () => {
    const res = await request(app).get("/movie");
    expect(res.body).toEqual({ message: "movie route healthcheck is working." });
  });

  test("Return 400 if year and page is not passed in getmoviebyyear", async () => {
    const res = await request(app).get("/movie/getmoviebyyear");
    expect(res.body.error).toEqual('Missing required parameters: page and year are required.');
  });
  
  test("Return 400 if year and page is invalid in getmoviebyyear", async () => {
    const res = await request(app).get("/movie/getmoviebyyear?page=1&year=xyz");
    expect(res.body.error).toEqual('Invalid required parameters: page and year should be number.');
  });

  it('should fetch a list of movies for a given page and year', async () => {
    // Mock the fetch response for movies
    fetchMock.mockResponseOnce(
      JSON.stringify({
        results: [
          { id: 1, title: 'Movie A', release_date: '2024-10-10', vote_average: 8.5 },
          { id: 2, title: 'Movie B', release_date: '2024-10-11', vote_average: 7.3 },
        ],
      })
    );

    // Mock the fetch response for movie editors
    fetchMock.mockResponseOnce(
      JSON.stringify({
        crew: [
          { name: 'Editor 1', known_for_department: 'Editing' },
          { name: 'Editor 2', known_for_department: 'Editing' },
        ],
      })
    );

    fetchMock.mockResponseOnce(
      JSON.stringify({
        crew: [
          { name: 'Editor 3', known_for_department: 'Editing' },
        ],
      })
    );

    const res = await request(app).get("/movie/getmoviebyyear?page=1&year=2024");

    expect(res.body.data).toEqual([
      {
        title: 'Movie A',
        release_date: '2024-10-10',
        vote_average: 8.5,
        editors: ['Editor 1', 'Editor 2'],
      },
      {
        title: 'Movie B',
        release_date: '2024-10-11',
        vote_average: 7.3,
        editors: ['Editor 3'],
      },
    ]);
  });

  it('should return movies without editors if editor fetch fails', async () => {
    // Mock the fetch response for movies
    fetchMock.mockResponseOnce(
      JSON.stringify({
        results: [
          { id: 1, title: 'Movie A', release_date: '2024-01-01', vote_average: 8.5 },
        ],
      })
    );

    // Mock a failed fetch response for movie editors
    fetchMock.mockRejectOnce(new Error('Failed to fetch editors'));

    const res = await request(app).get("/movie/getmoviebyyear?page=1&year=2024");

    expect(res.body.data).toEqual([
      {
        title: 'Movie A',
        release_date: '2024-01-01',
        vote_average: 8.5,
        editors: [],
      },
    ]);
  });

  it('should throw an error if movies fetch fails', async () => {
    // Mock a failed fetch response for movies
    fetchMock.mockRejectOnce(new Error('Failed to fetch movies'));
    const res = await request(app).get("/movie/getmoviebyyear?page=1&year=2024");

    expect(res.body.error).toEqual('Failed to fetch movies: Failed to fetch movies');
  });
});
