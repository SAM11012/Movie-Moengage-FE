import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Movie {
  imdbID: string;
  title: string;
  year: number;
  genre: string[];
  director: string;
  actors: string[];
  rating: number;
  runtime: number;
  plot: string;
  poster: string;
  language: string;
  country: string;
  awards: string;
  metascore: number;
  imdbRating: number;
  imdbVotes: string;
  boxOffice: string;
}

export type SortOption = "none" | "rating" | "year" | "title";
export type SortDirection = "asc" | "desc";

export interface MovieState {
  movies: Movie[];
  searchQuery: string;
  selectedGenres: string[];
  sortBy: SortOption;
  sortDirection: SortDirection;
}

const initialState: MovieState = {
  movies: [],
  searchQuery: "",
  selectedGenres: [],
  sortBy: "none",
  sortDirection: "desc",
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setMovies(state, action: PayloadAction<Movie[]>) {
      state.movies = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedGenres(state, action: PayloadAction<string[]>) {
      state.selectedGenres = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
    },
    setSortDirection(state, action: PayloadAction<SortDirection>) {
      state.sortDirection = action.payload;
    },
    resetMovieState(state) {
      state.movies = [];
      state.searchQuery = "";
      state.selectedGenres = [];
      state.sortBy = "none";
      state.sortDirection = "desc";
    },
  },
});

export const {
  setMovies,
  setSearchQuery,
  setSelectedGenres,
  setSortBy,
  setSortDirection,
  resetMovieState,
} = movieSlice.actions;

export default movieSlice.reducer;
