import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import {
  setMovies,
  setSearchQuery,
  setSelectedGenres,
  setSortBy,
  setSortDirection,
} from "@/store/movieSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../lib/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CenteredSpinner from "@/components/CenteredSpinner";
import MultiSelectGenre from "@/components/MultiSelectGenre";
import dummyposter from "../assets/dummyposter.jpg";

function downloadMoviesCSV(movies: Movie[]) {
  if (!movies.length) return;
  const headers = [
    "Title",
    "Year",
    "Genres",
    "Director",
    "Actors",
    "IMDB Rating",
    "Runtime",
    "Language",
    "Country",
    "Awards",
  ];
  const rows = movies.map((movie) => [
    movie.title,
    movie.year,
    Array.isArray(movie.genre) ? movie.genre.join("; ") : "",
    movie.director,
    Array.isArray(movie.actors) ? movie.actors.join("; ") : "",
    movie.imdbRating,
    movie.runtime,
    movie.language,
    movie.country,
    movie.awards,
  ]);
  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((field) =>
          typeof field === "string" &&
          (field.includes(",") || field.includes('"') || field.includes("\n"))
            ? `"${field.replace(/"/g, '""')}"`
            : field,
        )
        .join(","),
    )
    .join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "movies.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface Movie {
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

type SortOption = "none" | "rating" | "year" | "title";
type SortDirection = "asc" | "desc";

export default function HomePage() {
  const movies = useSelector((state: RootState) => state.movie.movies);
  const searchQuery = useSelector(
    (state: RootState) => state.movie.searchQuery,
  );
  const selectedGenres = useSelector(
    (state: RootState) => state.movie.selectedGenres,
  );
  const sortBy = useSelector((state: RootState) => state.movie.sortBy);
  const sortDirection = useSelector(
    (state: RootState) => state.movie.sortDirection,
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch trending movies on mount
    const fetchTrending = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get<{ data: { movies: Movie[] } }>(
          API_ENDPOINTS.MOVIES_TRENDING,
        );
        console.log(response.data);
        dispatch(setMovies(response.data.data.movies || []));
        toast.success("Trending movies loaded!");
      } catch (err: any) {
        setError("Failed to fetch trending movies.");
        toast.error(err?.response?.data?.message||"Failed to fetch trending movies.");
      } finally {
        setLoading(false);
      }
    };
    if (movies.length == 0) {
      // fetchTrending();
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    try {
      let url = `${API_ENDPOINTS.MOVIES_SEARCH}?search=${encodeURIComponent(searchQuery)}&page=1`;
      if (sortBy === "rating") {
        url += "&sort=rating";
      }
      const response = await axios.get<{ data: { movies: Movie[] } }>(url);
      dispatch(setMovies(response.data.data.movies || []));
      toast.success("Search results loaded!");
    } catch (err: any) {
      console.log(err.response.data.message);
      setError("Failed to fetch search results.");
      toast.error(
        err?.response?.data?.message || "Failed to fetch search results.",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedMovies =
    useMemo(() => {
      if (!Array.isArray(movies)) return [];
      // Create a new array to avoid mutating the original
      let filtered = [...movies].filter((movie) => {
        const genreArr = Array.isArray(movie.genre) ? movie.genre : [];
        const matchesSearch =
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          genreArr.some((g) =>
            g.toLowerCase().includes(searchQuery.toLowerCase()),
          );

        const matchesGenre =
          selectedGenres.length === 0 ||
          selectedGenres.some((selected) =>
            genreArr.some((g) => g.toLowerCase() === selected.toLowerCase()),
          );

        return matchesSearch && matchesGenre;
      });

      if (sortBy !== "none") {
        filtered = filtered.sort((a, b) => {
          let aValue: string | number;
          let bValue: string | number;

          switch (sortBy) {
            case "rating":
              aValue = Number(a.imdbRating) || 0;
              bValue = Number(b.imdbRating) || 0;
              break;
            case "year":
              aValue = Number(a.year) || 0;
              bValue = Number(b.year) || 0;
              break;
            case "title":
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            default:
              return 0;
          }

          if (sortDirection === "asc") {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          }
        });
      }

      return filtered;
    }, [movies, searchQuery, selectedGenres, sortBy, sortDirection]) || [];

  // Removed unused toggleSortDirection and handleSortChange functions

  // Add a unique key generator to prevent React key conflicts
  const getUniqueKey = (movie: Movie, index: number) => {
    return `${movie.imdbID}-${index}`;
  };

  console.log(movies, "the movies");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 lg:max-w-lg w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    dispatch(setSearchQuery(value));
                    if (!value.trim()) {
                      dispatch(setMovies([]));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Genre Filter & Download Button Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto md:ml-4">
              <MultiSelectGenre
                genres={[
                  "Action",
                  "Drama",
                  "Crime",
                  "Science Fiction",
                  // Add more genres as needed
                ]}
                selected={selectedGenres}
                onChange={(vals) => dispatch(setSelectedGenres(vals))}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadMoviesCSV(filteredAndSortedMovies)}
                disabled={filteredAndSortedMovies.length === 0}
                className="sm:ml-2"
              >
                Download CSV
              </Button>
            </div>
          </div>

          {/* Sorting Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (sortBy === "rating") {
                  dispatch(
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc"),
                  );
                } else {
                  dispatch(setSortBy("rating"));
                  dispatch(setSortDirection("desc"));
                }
              }}
              className={`${sortBy === "rating" ? "bg-brand-red hover:bg-brand-red-hover" : ""}`}
            >
              Rating
              {sortBy === "rating" &&
                (sortDirection === "desc" ? (
                  <ArrowDown className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowUp className="ml-1 h-3 w-3" />
                ))}
            </Button>
            <Button
              variant={sortBy === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (sortBy === "year") {
                  dispatch(
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc"),
                  );
                } else {
                  dispatch(setSortBy("year"));
                  dispatch(setSortDirection("desc"));
                }
              }}
              className={`${sortBy === "year" ? "bg-brand-red hover:bg-brand-red-hover" : ""}`}
            >
              Year
              {sortBy === "year" &&
                (sortDirection === "desc" ? (
                  <ArrowDown className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowUp className="ml-1 h-3 w-3" />
                ))}
            </Button>
            <Button
              variant={sortBy === "title" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (sortBy === "title") {
                  dispatch(
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc"),
                  );
                } else {
                  dispatch(setSortBy("title"));
                  dispatch(setSortDirection("desc"));
                }
              }}
              className={`${sortBy === "title" ? "bg-brand-red hover:bg-brand-red-hover" : ""}`}
            >
              Title
              {sortBy === "title" &&
                (sortDirection === "desc" ? (
                  <ArrowDown className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowUp className="ml-1 h-3 w-3" />
                ))}
            </Button>
            {sortBy !== "none" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(setSortBy("none"))}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Sort
              </Button>
            )}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <CenteredSpinner />
        ) : error ? (
          <div className="text-center py-10 text-lg text-red-500">{error}</div>
        ) : !searchQuery.trim() ? (
          <div className="text-center py-10 text-lg text-muted-foreground">
            No movies 🔴 Type to search 🙈 & Enter
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Fixed: Use filteredAndSortedMovies instead of movies */}
            {filteredAndSortedMovies.map((movie, index) => (
              <div
                key={getUniqueKey(movie, index)}
                className="group cursor-pointer"
                onClick={() => {
                  navigate(`/movie/${movie.imdbID}`);
                }}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800">
                  <img
                    src={movie.poster || dummyposter}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-white text-sm font-medium">
                        {movie.imdbRating}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-white text-xs">{movie.year}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <h3 className="text-foreground font-medium group-hover:text-brand-red transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground space-x-2">
                    <span>{movie.runtime} min</span>
                    <span>Director: {movie.director}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {movie.genre.map((g) => (
                      <span
                        key={g}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
