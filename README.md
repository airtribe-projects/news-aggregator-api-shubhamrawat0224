# News Aggregator API

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19628518&assignment_repo_type=AssignmentRepo)

A RESTful API that aggregates news articles from various sources based on user preferences. Built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Personalized news feed based on user preferences
- News articles fetched from GNews API
- MongoDB database integration
- RESTful API endpoints
- Comprehensive test suite

## Prerequisites

- Node.js >= 18.0.0
- MongoDB
- GNews API key

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the root directory with the following variables:
   ```env
   PORT=3000
   GNEWS_API_KEY=your_gnews_api_key
   JWT_SECRET=your_jwt_secret
   URI=your_mongodb_connection_string
   ```

## Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm start

# Run tests
npm test
```

## API Endpoints

### Authentication

- **POST /users/signup**
  - Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string", "preferences": ["string"] }`

- **POST /users/login**
  - Login user
  - Body: `{ "email": "string", "password": "string" }`

### User Preferences

- **GET /users/preferences**
  - Get user preferences
  - Requires authentication

- **PUT /users/preferences**
  - Update user preferences
  - Requires authentication
  - Body: `{ "preferences": ["string"] }`

### News

- **GET /news**
  - Get personalized news feed
  - Requires authentication
  - Returns news articles based on user preferences

## Testing

The project includes a comprehensive test suite using the `tap` testing framework. Run the tests with:

```bash
npm test
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 500: Internal Server Error

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- axios: HTTP client
- cors: Cross-origin resource sharing
- dotenv: Environment variables