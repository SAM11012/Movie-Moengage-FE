import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Plus, Share } from "lucide-react";
import Header from "@/components/Header";
import axios from "axios";
import { useTheme } from "@/contexts/ThemeContext";
import { API_ENDPOINTS } from "../lib/config";

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

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<{ data: Movie }>(
          API_ENDPOINTS.MOVIE_DETAILS(id!),
        );
        setMovie(response.data.data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchMovie();
  }, [id]);
  console.log(movie);
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-lg text-muted-foreground">
          Loading movie details...
        </span>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-lg text-destructive">
          Error: {error || "Movie not found"}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        showBackButton={true}
        backLink="/"
        backText="Back"
        showActions={true}
        title="Movie Details"
      />

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover blur-md"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1
              className={`text-4xl md:text-6xl font-bold mb-4 ${theme === "light" ? "text-black" : "text-white"}`}
            >
              {movie.title}
            </h1>
            <div
              className={`flex flex-wrap items-center gap-4 mb-6 ${theme === "light" ? "text-black" : "text-white/90"}`}
            >
              <span className="flex items-center space-x-1">
                <span>📅</span>
                <span>{movie.year}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>⏱️</span>
                <span>{movie.runtime} min</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🌍</span>
                <span>{movie.language}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🏆</span>
                <span>{movie.awards}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {movie.genre.map((genre) => (
                <span
                  key={genre}
                  className={`bg-secondary px-3 py-1 rounded-full text-sm ${theme === "light" ? "text-black" : "text-secondary-foreground"}`}
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-1 mb-6">
              <span className="text-yellow-400 text-xl">★</span>
              <span
                className={`font-medium ml-2 ${theme === "light" ? "text-black" : "text-white"}`}
              >
                {movie.imdbRating}/10
              </span>
              <span
                className={`ml-2 ${theme === "light" ? "text-black" : "text-white/70"}`}
              >
                ({movie.imdbVotes} votes)
              </span>
              <span
                className={`ml-2 ${theme === "light" ? "text-black" : "text-white/70"}`}
              >
                Metascore: {movie.metascore}
              </span>
            </div>

            <p
              className={`max-w-2xl text-lg mb-8 ${theme === "light" ? "text-black" : "text-white/90"}`}
            >
              {movie.plot.slice(0, 105) + "..."}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3"
                onClick={() =>
                  window.open(
                    `https://www.imdb.com/title/${movie.imdbID}`,
                    "_blank",
                  )
                }
              >
                <Play className="h-5 w-5 mr-2" />
                View on IMDB
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Poster */}
          <div className="lg:col-span-1">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Movie Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-muted-foreground mb-2">Director</h3>
                  <p className="text-foreground font-medium">
                    {movie.director}
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground mb-2">Box Office</h3>
                  <p className="text-foreground font-medium">
                    {movie.boxOffice}
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground mb-2">Language</h3>
                  <p className="text-foreground font-medium">
                    {movie.language}
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground mb-2">Country</h3>
                  <p className="text-foreground font-medium">{movie.country}</p>
                </div>
                <div>
                  <h3 className="text-muted-foreground mb-2">Awards</h3>
                  <p className="text-foreground font-medium">{movie.awards}</p>
                </div>
                <div>
                  <h3 className="text-muted-foreground mb-2">Metascore</h3>
                  <p className="text-foreground font-medium">
                    {movie.metascore}
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground mb-2">IMDB Rating</h3>
                  <p className="text-foreground font-medium">
                    {movie.imdbRating}/10
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground mb-2">IMDB Votes</h3>
                  <p className="text-foreground font-medium">
                    {movie.imdbVotes}
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground mb-2">Runtime</h3>
                  <p className="text-foreground font-medium">
                    {movie.runtime} min
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-muted-foreground mb-2">Actors</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.actors.map((actor) => (
                    <span
                      key={actor}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-muted-foreground mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((genre) => (
                    <span
                      key={genre}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Plot</h2>
              <p className="text-muted-foreground leading-relaxed">
                {movie.plot}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
