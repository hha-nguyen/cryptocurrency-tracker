# Cryptocurrency Tracker - Backend

This is the backend service for the Cryptocurrency Tracker application, built with Node.js, Express, TypeScript, and SQLite.

## Features

- RESTful API for cryptocurrency data
- Current price endpoint for cryptocurrencies
- Historical price data with database storage
- Favorites management
- Caching to reduce API calls to CoinGecko

## Prerequisites

- Node.js (v14 or higher)
- Yarn package manager

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
yarn install
```

## Environment Setup

Create a `.env` file in the root of the backend directory with the following variables:

```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Database Setup

The application uses SQLite for data storage. The database file will be created automatically in the `db` directory when you start the application. Database migrations will run automatically before the application starts.

To run migrations manually:

```bash
yarn migrate
```

To create a new migration:

```bash
yarn migrate:make <migration_name>
```

To rollback the last migration:

```bash
yarn migrate:rollback
```

## Development

To start the development server with hot reloading:

```bash
yarn dev
```

This will:

1. Run database migrations
2. Start the server on port 5000 (or the port specified in your .env file)
3. Watch for file changes and restart automatically

## Production Build

To create a production build:

```bash
yarn build
```

To run the production build:

```bash
yarn start
```

## API Endpoints

### Cryptocurrency Data

- `GET /api/price/:symbol` - Get current price for a cryptocurrency
- `GET /api/history/:symbol/:days` - Get price history for a cryptocurrency

### Favorites

- `GET /api/favorites` - Get all favorites
- `POST /api/favorites` - Add a cryptocurrency to favorites (requires symbol and name in request body)
- `DELETE /api/favorites/:symbol` - Remove a cryptocurrency from favorites

### Health Check

- `GET /health` - Check if the API is healthy

## License

MIT
