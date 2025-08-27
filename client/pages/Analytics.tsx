import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Eye, Star } from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
);

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const stats = [
    {
      title: "Total Movies",
      value: "15,420",
      change: "+5.5% from last month",
      icon: TrendingUp,
      color: "text-blue-400",
    },
    {
      title: "Total Users",
      value: "89,340",
      change: "+12.3% from last month",
      icon: Users,
      color: "text-green-400",
    },
    {
      title: "Total Views",
      value: "2.3M",
      change: "+8.7% last month",
      icon: Eye,
      color: "text-purple-400",
    },
    {
      title: "Avg Rating",
      value: "7.8/10",
      change: "+0.3% from last month",
      icon: Star,
      color: "text-yellow-400",
    },
  ];

  const topMovies = [
    { rank: 1, title: "The Shawshank Redemption", rating: 9.3 },
    { rank: 2, title: "The Dark Knight", rating: 9.1 },
    { rank: 3, title: "Pulp Fiction", rating: 8.9 },
    { rank: 4, title: "Fight Club", rating: 8.8 },
    { rank: 5, title: "Inception", rating: 8.8 },
  ];

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<{ data: any }>(
          "http://localhost:5173/api/analytics/dashboard",
        );
        setDashboardData(response.data.data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  // Prepare genres data for chart
  const genreColors = [
    "#ef4444",
    "#3b82f6",
    "#eab308",
    "#22c55e",
    "#a855f7",
    "#ec4899",
    "#f59e42",
    "#10b981",
    "#6366f1",
    "#f43f5e",
    "#84cc16",
    "#f472b6",
    "#0ea5e9",
    "#facc15",
  ];

  let genres: { name: string; percentage: number; color: string }[] = [];
  let doughnutChartData: { labels: string[]; datasets: any[] } = {
    labels: [],
    datasets: [],
  };

  if (dashboardData && dashboardData.genres && dashboardData.overview) {
    const totalMovies = dashboardData.overview.totalMovies;
    genres = dashboardData.genres.map((g: any, idx: number) => ({
      name: g.genre,
      percentage: Math.round((g.count / totalMovies) * 100),
      color: genreColors[idx % genreColors.length],
    }));

    doughnutChartData = {
      labels: genres.map((g) => g.name),
      datasets: [
        {
          data: genres.map((g) => g.percentage),
          backgroundColor: genres.map((g) => g.color),
          borderColor: genres.map((g) => g.color),
          borderWidth: 2,
          hoverBorderWidth: 3,
        },
      ],
    };
  }

  // Bar Chart Data (Average Ratings by Genre)
  let barChartData = { labels: [], datasets: [] };
  if (dashboardData && dashboardData.genres) {
    barChartData = {
      labels: dashboardData.genres.map((g: any) => g.genre),
      datasets: [
        {
          label: "Average Rating",
          data: dashboardData.genres.map((g: any) => g.avgRating),
          backgroundColor: dashboardData.genres.map(
            (g: any, idx: number) => genreColors[idx % genreColors.length],
          ),
          borderColor: dashboardData.genres.map(
            (g: any, idx: number) => genreColors[idx % genreColors.length],
          ),
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }

  // Line Chart Data (Average Runtime by Year)
  let lineChartData = { labels: [], datasets: [] };
  if (dashboardData && dashboardData.yearly) {
    lineChartData = {
      labels: dashboardData.yearly.map((y: any) => y.year),
      datasets: [
        {
          label: "Average Runtime (min)",
          data: dashboardData.yearly.map((y: any) => y.avgRuntime),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#ef4444",
          pointBorderColor: "#ef4444",
          pointHoverBackgroundColor: "#dc2626",
          pointHoverBorderColor: "#dc2626",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#ef4444",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed.y} min`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
          min: 0,
        },
      },
    },
  };

  // Doughnut Chart Data (Genre Distribution)
  // doughnutChartData is now dynamically set above

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#ef4444",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return context.label + ": " + context.parsed + "%";
          },
        },
      },
    },
    cutout: "60%",
  };

  // Bar Chart Options (for Average Ratings by Genre)
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#ef4444",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return context.parsed.y;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
          min: 0,
          max: 10,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        showBackButton={true}
        backLink="/"
        backText=""
        title="Analytics Dashboard"
        showActions={true}
      />
      {user?.role !== "admin" ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-lg">
            This page is only visible to admin users.
          </p>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="card-gradient border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-green-400 mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div> */}

          {/* Navigation Tabs */}
          {/* <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            <Button variant="ghost" className="border-b-2 border-brand-red text-foreground">
              Overview
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Genres
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Performance
            </Button>
          </nav>
        </div> */}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Average Runtime by Year */}
            <div
              className={`${theme === "light" ? "bg-white" : "card-gradient"} border border-border rounded-lg p-6`}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Average Runtime by Year
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Yearly average runtime (minutes)
              </p>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <span className="text-muted-foreground">
                    Loading average runtime by year...
                  </span>
                </div>
              ) : error ? (
                <div className="h-64 flex items-center justify-center">
                  <span className="text-destructive">Error: {error}</span>
                </div>
              ) : (
                <div className="h-64">
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
              )}
            </div>

            {/* Genre Distribution */}
            <div
              className={`${theme === "light" ? "bg-white" : "card-gradient"} border border-border rounded-lg p-6`}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Genre Distribution
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Movies by genre
              </p>

              {loading ? (
                <div className="h-48 flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">
                    Loading genre distribution...
                  </span>
                </div>
              ) : error ? (
                <div className="h-48 flex items-center justify-center mb-4">
                  <span className="text-destructive">Error: {error}</span>
                </div>
              ) : (
                <>
                  <div className="h-48 flex items-center justify-center mb-4">
                    <div className="w-48 h-48">
                      <Doughnut
                        data={doughnutChartData}
                        options={doughnutChartOptions}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {genres.map((genre) => (
                      <div
                        key={genre.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: genre.color }}
                          ></div>
                          <span className="text-sm text-foreground">
                            {genre.name}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {genre.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Rated Movies */}
            <div
              className={`${theme === "light" ? "bg-white" : "card-gradient"} border border-border rounded-lg p-6`}
            >
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Top Rated Movies
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Highest rated content
              </p>

              <div className="space-y-3">
                {topMovies.map((movie) => (
                  <div
                    key={movie.rank}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {movie.rank}
                      </span>
                      <span className="text-foreground font-medium">
                        {movie.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-foreground font-medium">
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Average Ratings by Genre */}
            <div
              className={`${theme === "light" ? "bg-white" : "card-gradient"} border border-border rounded-lg p-6`}
            >
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Average Ratings by Genre
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Average IMDB ratings for each genre
              </p>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <span className="text-muted-foreground">
                    Loading ratings by genre...
                  </span>
                </div>
              ) : error ? (
                <div className="h-64 flex items-center justify-center">
                  <span className="text-destructive">Error: {error}</span>
                </div>
              ) : (
                <div className="h-64">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
