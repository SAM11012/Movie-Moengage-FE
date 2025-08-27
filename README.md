# MovieFlix

A modern, full-stack movie analytics and discovery platform built with React, Redux, Vite, and Node.js. MovieFlix allows users to search, browse, and analyze movies, with a beautiful dashboard, authentication, and responsive UI.

## Features

- 🔥 Trending and searchable movie listings
- 🎬 Detailed movie pages with ratings, genres, cast, and more
- 📊 Analytics dashboard for admins (charts, stats, top movies)
- 🧑‍💻 User authentication (Sign Up, Login, Forgot Password)
- 🌗 Light/dark theme support
- 🚀 Responsive design for all devices
- 🛡️ Secure password handling with visibility toggles
- 🧭 SPA routing with Vercel deployment support
- 🛠️ Toast notifications for all API actions (success/error)
- 🎨 Custom loaders and spinners

## Tech Stack

- **Frontend:** React, Redux, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express (see `/server`)
- **Charts:** Chart.js, react-chartjs-2
- **UI:** Lucide icons, custom components
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- [Vercel account](https://vercel.com/) (for deployment)

### Installation

```bash
# Clone the repo
git clone https://github.com/SAM11012/Movie-Moengage-FE.git
cd Movie-Moengage-FE

# Install dependencies
pnpm install
# or
npm install
# or
yarn install
```

### Running Locally

```bash
# Start the frontend (Vite)
pnpm run dev
# or
npm run dev
# or
yarn dev

# Start the backend (in another terminal)
pnpm run dev:server
# or
npm run dev:server
# or
yarn dev:server
```

The app will be available at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).

### Building for Production

```bash
pnpm run build
# or
npm run build
# or
yarn build
```

### Deployment

- Deploy the `dist/spa` directory to Vercel for the frontend.
- Set the output directory in Vercel to `dist/spa`.
- Ensure backend API is deployed and accessible.

## Environment Variables

Create a `.env` file in the root with the following (example):

```
VITE_API_BASE_URL=https://your-backend-api.com
```

## Folder Structure

```
.
├── client/                # Frontend source code
│   ├── assets/            # Images and static assets
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and config
│   ├── pages/             # Page components (routes)
│   ├── store/             # Redux store and slices
│   ├── contexts/          # React context providers
│   └── global.css         # Global styles
├── server/                # Backend (Node.js/Express)
├── public/                # Public static files
├── dist/                  # Production build output
├── index.html             # Main HTML entry
├── package.json           # Project metadata and scripts
├── vite.config.ts         # Vite configuration
├── vercel.json            # Vercel SPA routing config (if present)
└── README.md              # This file
```

## Contribution

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

[MIT](LICENSE)

## Contact

- GitHub: [SAM11012](https://github.com/SAM11012)
- Deployed App: [https://movie-moengage-fe.vercel.app/](https://movie-moengage-fe.vercel.app/)
