```markdown:README.md
# Task Management System

A RESTful API for managing tasks built with TypeScript, Express, and PostgreSQL using Sequelize ORM.

## Features

- User authentication and authorization
- CRUD operations for tasks
- Task status management
- Pagination and search functionality
- Role-based access control
- Input validation
- Error handling

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Sequelize ORM
- Jest (Testing)
- JWT Authentication

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm/yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=task_management
ACCESS_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
```

4. Database setup:
```bash
# Create database
npx sequelize-cli db:create

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed:all
```

## Available Scripts

```bash
npm run dev          # Start development server
npm start           # Start production server
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## API Documentation

### Authentication
```
POST /api/auth/sign-up     # Register new user
POST /api/auth/login       # Login
POST /api/auth/refresh     # Refresh token
```

### Tasks
```
GET    /api/tasks         # Get all tasks (with pagination)
POST   /api/tasks         # Create new task
PUT    /api/tasks/:id     # Update task
DELETE /api/tasks/:id     # Delete task
```

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status
- `search`: Search in title/description

## Project Structure
```
src/
├── config/         # App configuration
├── constants/      # Constants and enums
├── controllers/    # Request handlers
├── middlewares/    # Custom middlewares
├── models/         # Sequelize models
├── repositories/   # Data access layer
├── routes/         # API routes
├── services/       # Business logic
├── tests/          # Test files
│   ├── integration/
│   └── unit/
└── utils/         # Utility functions
```

## Testing

The project includes comprehensive test coverage:
- Unit tests for services, repositories, and controllers
- Integration tests for API endpoints
- Test utilities and mocks
- Coverage reporting

## Error Handling

- Custom error classes
- Global error middleware
- Structured error responses
- Validation error handling

## Security Features

- JWT authentication
- Password hashing
- Role-based access control
- Request validation
- Rate limiting
- XSS protection
- CORS configuration

## License

ISC

## Author

Ericsson Raphael
```